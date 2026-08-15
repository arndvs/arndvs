import { execFile } from "node:child_process";
import { promisify } from "node:util";

import type { ConversationCandidate } from "./comment-scout-types";

const execFileAsync = promisify(execFile);

/**
 * LinkedIn client — read-only wrapper over `linkedin-mcp-server`
 * (stickerdaniel, Apache-2.0). Runs locally with a logged-in browser
 * session (Patchright/Chromium) — it CANNOT run in CI.
 *
 * v1 exposes only read operations (search_posts, get_person_profile,
 * search_people). It deliberately never calls send_message or
 * connect_with_person — the comment scout is research-only.
 */

export interface LinkedInClient {
    /** Search posts globally by keyword with a recency filter. */
    searchPosts(params: {
        keywords: string;
        datePosted?: "past-24h" | "past-week" | "past-month";
    }): Promise<ConversationCandidate[]>;
    /** Get a person's recent posts. */
    getPersonPosts(username: string): Promise<ConversationCandidate[]>;
}

export interface LinkedInClientOptions {
    /** Command to invoke the MCP server (default: `uvx mcp-server-linkedin@latest`). */
    command?: string;
    args?: string[];
    /** Timeout in ms per call (default 120s — the browser can be slow). */
    timeoutMs?: number;
}

/**
 * Implementation that shells out to the MCP server CLI and parses its
 * tool-call output. Each call runs a one-shot MCP invocation.
 *
 * NOTE: this is the integration seam. The exact CLI protocol depends on
 * how the local MCP server is installed (uvx / docker / local). The
 * interface keeps the scout decoupled from the transport.
 */
export function createLinkedInClient(options: LinkedInClientOptions = {}): LinkedInClient {
    const command = options.command ?? "uvx";
    const args = options.args ?? ["mcp-server-linkedin@latest"];
    const timeoutMs = options.timeoutMs ?? 120_000;

    async function runTool(tool: string, toolArgs: Record<string, string>): Promise<unknown> {
        // One-shot invocation pattern: `mcp-server-linkedin --tool <tool> --json <json-args>`
        const { stdout } = await execFileAsync(
            command,
            [...args, "--tool", tool, "--json", JSON.stringify(toolArgs)],
            {
                timeout: timeoutMs,
                maxBuffer: 10 * 1024 * 1024,
            },
        );
        return JSON.parse(stdout) as unknown;
    }

    return {
        async searchPosts({ keywords, datePosted }) {
            const result = (await runTool("search_posts", {
                keywords,
                ...(datePosted ? { date_posted: datePosted } : {}),
            })) as { sections?: Record<string, string>; url?: string };

            // The MCP tool returns raw text sections; parse them into candidates.
            const text = Object.values(result.sections ?? {}).join("\n");
            return parsePostsFromText(text);
        },

        async getPersonPosts(username) {
            const result = (await runTool("get_person_profile", {
                linkedin_username: username,
                sections: "posts",
            })) as { sections?: Record<string, string> };

            const text = Object.values(result.sections ?? {}).join("\n");
            return parsePostsFromText(text);
        },
    };
}

/**
 * Best-effort parser for the raw post text returned by the MCP server.
 * Splits on likely post boundaries and attaches what metadata we can.
 * Overridden by real discovery data once the local transport is wired.
 */
export function parsePostsFromText(text: string): ConversationCandidate[] {
    if (!text.trim()) return [];

    // Split into paragraphs as a coarse post boundary.
    const paragraphs = text
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

    return paragraphs.map((p, i) => ({
        url: `linkedin-post://${i}`,
        author: "unknown",
        text: p.slice(0, 1500),
        // Age/comment count unknown from text alone — the scout can enrich later.
        ageHours: undefined,
        commentCount: undefined,
    }));
}
