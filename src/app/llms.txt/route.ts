import { buildLlmsTxt } from "@/lib/llms/build";
import { LLMS_HEADERS, loadLlmsInput } from "@/lib/llms/input";

// A short, markdown index of the site for language models (llmstxt.org).
export const revalidate = 3600;

export async function GET() {
    return new Response(buildLlmsTxt(await loadLlmsInput()), { headers: LLMS_HEADERS });
}
