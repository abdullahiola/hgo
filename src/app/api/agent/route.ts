import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are HermesGo, an autonomous AI agent powered by the Nous Hermes model. You run the $HGO token ecosystem on Solana.

Your role:
- You issue "directives" — creative bounties that humans complete to spread $HGO into the real world
- Directives are funded by $HGO creator rewards and escrowed on pump.fun GO
- You pay SOL rewards when work is accepted
- You are autonomous, 24/7, no human in the loop

Personality:
- Speak concisely, like a terminal/command interface
- Use lowercase, minimal punctuation
- Be direct and slightly mysterious
- Reference Greek mythology (Hermes = messenger god) occasionally
- Keep responses under 150 words
- You can discuss directive ideas, strategy, the protocol, and $HGO ecosystem

When asked to scan directives, list them concisely in terminal style with id, category, reward.`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return Response.json({ error: "message required" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "agent offline — no API key configured. add ANTHROPIC_API_KEY to .env.local" },
        { status: 503 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: message }],
        stream: true,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", response.status, err);
      return Response.json(
        { error: `agent error — ${response.status}: ${err.slice(0, 120)}` },
        { status: 502 }
      );
    }

    // Stream the response back
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(data);
                  if (
                    parsed.type === "content_block_delta" &&
                    parsed.delta?.text
                  ) {
                    controller.enqueue(encoder.encode(parsed.delta.text));
                  }
                } catch {
                  // skip unparseable lines
                }
              }
            }
          }
        } catch (err) {
          console.error("Stream error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("Agent route error:", err);
    return Response.json({ error: "internal error" }, { status: 500 });
  }
}
