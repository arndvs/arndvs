import type { JobCandidate } from "./job-types";

/**
 * LinkedIn jobs client — thin wrapper over the local `linkedin-mcp-server`
 * running as a streamable-http daemon.
 *
 * Transport: the MCP server exposes an HTTP endpoint
 * (http://127.0.0.1:{port}/mcp). The client drives the MCP JSON-RPC
 * protocol directly over HTTP (initialize → tools/list → tools/call) so
 * the daily job can talk to a daemon started once, without spawning a
 * browser per call.
 *
 * Read-only: only exposes search_jobs + get_job_details. Never applies.
 */

export interface LinkedInJobsClient {
    searchJobs(params: {
        keywords: string;
        location?: string;
        maxPages?: number;
    }): Promise<JobCandidate[]>;
    getJobDetails(jobId: string): Promise<JobCandidate | null>;
}

export interface LinkedInJobsClientOptions {
    /** Daemon base URL (default http://127.0.0.1:8899/mcp). */
    baseUrl?: string;
    /** Timeout in ms per call (default 120s). */
    timeoutMs?: number;
}

interface McpResponse {
    result?: {
        content?: Array<{ type: string; text?: string }>;
        tools?: Array<{ name: string }>;
    };
    error?: { message?: string };
}

export const DEFAULT_MCP_BASE_URL = "http://127.0.0.1:8899/mcp";

/**
 * Parse the raw search_jobs result text into structured job candidates.
 * The MCP tool returns markdown-ish text sections; we extract the fields
 * the job scout needs: title, company, location, work type, salary, age.
 *
 * LinkedIn search result shape (from the MCP tool):
 *   `<header lines: "X results", "Set alert", nav>`
 *   `<blank>`
 *   `<job title>`            ← repeated twice ("... with verification")
 *   `<company>`
 *   `<location> (Work Type)`
 *   `<salary> · benefits`
 *   `<age> ago`
 *   `<blank>`
 */
/**
 * Best-effort extraction of a LinkedIn job permalink from a raw line.
 * The search result text does not reliably embed URLs, so this is a
 * fallback — the durable dedupe key is the composite (title+company+location).
 */
const JOB_URL_RE = /(https?:\/\/[^\s]+linkedin\.com\/jobs\/view\/\d+[^\s]*)/i;

export function extractJobUrl(line: string): string | undefined {
    const m = line.match(JOB_URL_RE);
    if (!m?.[1]) return undefined;
    // Strip tracking params so the URL is stable for dedupe.
    return m[1].split("?")[0];
}

/**
 * Composite dedupe key — the search text has no reliable URL, so we key on
 * the fields the parser actually extracts. Normalized (lowercase, collapsed
 * whitespace) so minor formatting differences don't split the same job.
 */
export function jobDedupeKey(
    candidate: Pick<JobCandidate, "title" | "company" | "location">,
): string {
    const parts = [candidate.title, candidate.company, candidate.location]
        .filter(Boolean)
        .map((p) => String(p).toLowerCase().replace(/\s+/g, " ").trim());
    return parts.join("|");
}

export function parseJobsFromText(text: string): JobCandidate[] {
    if (!text.trim()) return [];

    // Header/nav lines that are never job titles.
    const SKIP =
        /^(set alert|set job|jump to|viewed|with verification|within the past|\d[\d,+]*\s*results?$|results?$)/i;
    // Lines that end the header region.
    const HEADER_END = /^\d[\d,+]*\s*results?$/;

    const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
    const jobs: JobCandidate[] = [];
    let current: JobCandidate | null = null;
    let header = true;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue; // noUncheckedIndexedAccess guard

        // Skip everything until we've seen the results count line.
        if (header) {
            if (HEADER_END.test(line)) header = false;
            continue;
        }

        // A new job block starts when we see a non-nav, non-short line.
        const isNav = SKIP.test(line) || line.length < 3;
        if (!current && !isNav) {
            // Heuristic: a plausible job title is 3+ words, no salary/dollar,
            // not a pure location. Guard: the next non-empty line should be
            // a company (title length > line we just saw, or contains "with").
            current = { url: extractJobUrl(line) ?? "", title: line, source: "search:date" };
            continue;
        }

        if (!current) continue;

        // Title is repeated ("... with verification") — dedupe, don't re-read.
        if (
            line === current.title ||
            (line.endsWith("with verification") && line.startsWith(current.title)) ||
            (SKIP.test(line) && line.startsWith(current.title))
        ) {
            continue;
        }
        // Nav/artifact lines while a job is current — skip, don't treat as company.
        if (SKIP.test(line)) continue;

        // Work type.
        if (/(remote|hybrid|on-site)/i.test(line) && !current.workType) {
            if (/remote/i.test(line)) current.workType = "remote";
            else if (/hybrid/i.test(line)) current.workType = "hybrid";
            else current.workType = "on-site";
            // Location often precedes: "Cottonwood Heights, UT (Remote)"
            const locMatch = line.match(/^(.+?)\s*\((remote|hybrid|on-site)\)/i);
            const locText = locMatch?.[1]?.trim();
            if (locText && !current.location) current.location = locText;
            if (!current.url) current.url = extractJobUrl(line) ?? "";
            continue;
        }

        // Location without work type paren.
        if (!current.location && /^[A-Za-z][a-zA-Z ,.-]+$/.test(line) && !current.company) {
            // Company is line before location; title is 2 lines before.
            if (current.company) {
                current.location = line;
                continue;
            }
        }

        // Company — a short line before the location; skip nav/salary/short.
        if (
            !current.company &&
            line.length >= 3 &&
            line.length <= 60 &&
            !line.includes("$") &&
            !/ago/i.test(line)
        ) {
            const next = lines[i + 1];
            const nextText = next?.trim();
            const looksLikeLocation =
                nextText !== undefined &&
                nextText !== "" &&
                nextText.length >= 3 &&
                /[A-Za-z]+(,|·|\()/.test(nextText) &&
                /[A-Z]{2,}/.test(nextText) === false;
            // Company lines are typically the token right before a location.
            if (!looksLikeLocation && !(nextText && /ago/i.test(nextText))) {
                current.company = line;
                if (!current.url) current.url = extractJobUrl(line) ?? "";
                continue;
            }
        }

        // Salary.
        if (/\$\d/.test(line) && !current.salary) {
            current.salary = line;
            if (!current.url) current.url = extractJobUrl(line) ?? "";
            continue;
        }

        // Age.
        if (/ago/i.test(line) && !current.ageHours) {
            const m = line.match(/(\d+)\s*(minute|hour|day|week)/i);
            const n = m?.[1] ? parseInt(m[1], 10) : undefined;
            const unit = m?.[2]?.toLowerCase();
            if (n !== undefined && unit) {
                current.ageHours = unit.startsWith("min")
                    ? n / 60
                    : unit.startsWith("hour")
                      ? n
                      : unit.startsWith("day")
                        ? n * 24
                        : unit.startsWith("week")
                          ? n * 168
                          : undefined;
            }
            continue;
        }

        // Blank-line boundary already handled by filter(Boolean); a new title
        // appears after a job's been built — flush and restart.
        if (
            current.title &&
            current.company &&
            line !== current.title &&
            !isNav &&
            !/ago|benefit|bar/i.test(line)
        ) {
            // Could be start of next block (short title-less row = ambiguity).
            if (line.length > 3 && /\s/.test(line) && /^\d/.test(line) === false) {
                jobs.push(current);
                current = { url: "", title: line, source: "search:date" };
            }
        }
    }
    if (current?.title) jobs.push(current);

    // Dedupe by composite key (title|company|location) — the search text has
    // no reliable URL, so this is the durable identity. First occurrence wins.
    const seen = new Set<string>();
    return jobs.filter((j) => {
        if (!j.title || j.title.length <= 3) return false;
        const key = jobDedupeKey(j);
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function makeRequest(baseUrl: string, httpTransport: typeof fetch, timeoutMs: number) {
    return async (body: unknown): Promise<McpResponse> => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const res = await httpTransport(baseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json, text/event-stream",
                },
                body: JSON.stringify(body),
                signal: controller.signal,
            });
            const text = await res.text();
            // streamable-http may return SSE; parse the data: lines.
            const json = text
                .split("\n")
                .filter((l) => l.startsWith("data:"))
                .map((l) => l.slice(5).trim())
                .join("\n");
            return JSON.parse(json || text) as McpResponse;
        } finally {
            clearTimeout(timer);
        }
    };
}

export function createLinkedInJobsClient(
    options: LinkedInJobsClientOptions = {},
): LinkedInJobsClient {
    const baseUrl = options.baseUrl ?? DEFAULT_MCP_BASE_URL;
    const timeoutMs = options.timeoutMs ?? 120_000;
    const request = makeRequest(baseUrl, fetch, timeoutMs);

    async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
        // Initialize the MCP session (mcp-session-id handled by response header).
        await request({
            jsonrpc: "2.0",
            id: 1,
            method: "initialize",
            params: {
                protocolVersion: "2024-11-05",
                capabilities: {},
                clientInfo: { name: "job-scout", version: "0.1.0" },
            },
        });
        const res = await request({
            jsonrpc: "2.0",
            id: 2,
            method: "tools/call",
            params: { name, arguments: args },
        }).catch(() => null);
        if (res?.error) throw new Error(String(res.error.message ?? "MCP tool error"));
        const content = res?.result?.content ?? [];
        return content.map((c) => c.text ?? "").join("\n");
    }

    return {
        async searchJobs({ keywords, location, maxPages = 1 }) {
            const raw = await callTool("search_jobs", {
                keywords,
                ...(location ? { location } : {}),
                max_pages: maxPages,
                sort_by: "date",
            });
            return parseJobsFromText(String(raw ?? ""));
        },

        async getJobDetails(jobId) {
            const raw = await callTool("get_job_details", { job_id: jobId });
            const text = String(raw ?? "");
            return text.trim()
                ? {
                      url: `https://www.linkedin.com/jobs/view/${jobId}`,
                      title: text.slice(0, 80),
                      source: "details",
                  }
                : null;
        },
    };
}
