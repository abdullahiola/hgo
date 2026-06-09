"use client";

import { useState, useRef, useEffect } from "react";

interface TerminalLine {
  type: "prompt" | "thinking" | "output" | "system";
  content: string;
}

export default function AgentTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "system", content: "HermesGo Agent v1.0 — Nous Hermes Model" },
    { type: "system", content: "Connected to directive engine. Standing by." },
    { type: "prompt", content: "> " },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  const handleSubmit = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput("");
    setIsStreaming(true);

    setLines((prev) => [
      ...prev.slice(0, -1),
      { type: "prompt", content: `> ${userMessage}` },
      { type: "thinking", content: "⟳ thinking..." },
    ]);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Agent unavailable");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let agentResponse = "";

      // Remove the "thinking..." line and add output line
      setLines((prev) => [
        ...prev.slice(0, -1),
        { type: "output", content: "" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        agentResponse += chunk;

        setLines((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            type: "output",
            content: agentResponse,
          };
          return updated;
        });
      }

      setLines((prev) => [...prev, { type: "prompt", content: "> " }]);
    } catch (err) {
      setLines((prev) => [
        ...prev.slice(0, -1),
        {
          type: "system",
          content: `[error] ${err instanceof Error ? err.message : "Connection failed"}`,
        },
        { type: "prompt", content: "> " },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section id="terminal" className="terminal-section">
      <div className="container terminal-section__inner">
        <p className="terminal-section__label">See it in action</p>
        <h2 className="terminal-section__title">The Agent&apos;s Mind</h2>
        <p className="terminal-section__subtitle">
          Watch the Hermes agent think in real-time. Ask it about directives,
          strategy, or anything about the $HGO ecosystem.
        </p>

        <div className="terminal">
          <div className="terminal__header">
            <div className="terminal__dots">
              <span className="terminal__dot terminal__dot--red" />
              <span className="terminal__dot terminal__dot--yellow" />
              <span className="terminal__dot terminal__dot--green" />
            </div>
            <span className="terminal__title-bar">Hermes</span>
            <div style={{ width: 52 }} />
          </div>

          <div className="terminal__body" ref={bodyRef}>
            {lines.map((line, i) => (
              <div key={i} className="terminal__line">
                {line.type === "prompt" && (
                  <span className="terminal__prompt">{line.content}</span>
                )}
                {line.type === "thinking" && (
                  <span className="terminal__thinking">{line.content}</span>
                )}
                {line.type === "output" && (
                  <span className="terminal__output">{line.content}</span>
                )}
                {line.type === "system" && (
                  <span className="terminal__thinking">{line.content}</span>
                )}
                {i === lines.length - 1 &&
                  line.type === "prompt" &&
                  !isStreaming && <span className="terminal__cursor" />}
                {i === lines.length - 1 &&
                  line.type === "output" &&
                  isStreaming && <span className="terminal__cursor" />}
              </div>
            ))}
          </div>

          <div className="terminal__input-row">
            <span style={{ color: "#7aa2f7", fontFamily: "var(--font-mono)", fontSize: "0.8125rem" }}>
              →
            </span>
            <input
              className="terminal__input"
              type="text"
              placeholder="Ask the agent anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
            />
            <button
              className="terminal__send-btn"
              onClick={handleSubmit}
              disabled={isStreaming || !input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
