const BASE_URL =
  process.env.MERGE_BASE_URL ?? "https://api-gateway.merge.dev/v1/responses";
const MODEL = process.env.MERGE_MODEL ?? "anthropic/claude-sonnet-5";

interface GatewayResponse {
  output?: Array<{
    content?: Array<{ type: string; text?: string }>;
  }>;
  error?: { message?: string };
}

async function callModel(system: string, user: string): Promise<string> {
  const apiKey = process.env.MERGE_API_KEY;
  if (!apiKey) throw new Error("MERGE_API_KEY is not set");

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      stream: false,
      max_output_tokens: 4000,
      input: [
        { type: "message", role: "system", content: system },
        { type: "message", role: "user", content: user },
      ],
    }),
  });

  const data = (await res.json()) as GatewayResponse;
  if (!res.ok || data.error) {
    throw new Error(
      `Gateway error (${res.status}): ${data.error?.message ?? "unknown"}`
    );
  }
  const text = data.output?.[0]?.content?.find(
    (c) => c.type === "text"
  )?.text;
  if (!text) throw new Error("Gateway returned no text content");
  return text;
}

function stripFences(text: string): string {
  let t = text.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```[a-z]*\s*\n?/i, "").replace(/\n?```\s*$/, "");
  }
  return t.trim();
}

/** Call the model expecting JSON; strip fences, retry once on parse failure. */
export async function callStage<T>(system: string, user: string): Promise<T> {
  let raw = await callModel(system, user);
  try {
    return JSON.parse(stripFences(raw)) as T;
  } catch {
    raw = await callModel(
      system,
      `${user}\n\nYour previous response was not valid JSON. Respond again with ONLY valid JSON matching the schema.`
    );
    return JSON.parse(stripFences(raw)) as T;
  }
}
