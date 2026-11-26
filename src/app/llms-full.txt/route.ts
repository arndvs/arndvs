import { buildLlmsFullTxt } from "@/lib/llms/build";
import { LLMS_HEADERS, loadLlmsInput } from "@/lib/llms/input";

// Every case study, result, talk and post in one file, for language models.
export const revalidate = 3600;

export async function GET() {
    return new Response(buildLlmsFullTxt(await loadLlmsInput()), { headers: LLMS_HEADERS });
}
