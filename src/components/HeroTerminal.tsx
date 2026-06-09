"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface TerminalLine {
  type: "prompt" | "thinking" | "output" | "system" | "error";
  content: string;
  id: number;
}

const BOOT_SEQUENCE = [
  { delay: 0,    text: "HERMES AGENT OS v1.0.0", type: "system" as const },
  { delay: 250,  text: "kernel: loading directive engine...", type: "system" as const },
  { delay: 550,  text: "kernel: escrow bridge ✓ connected", type: "system" as const },
  { delay: 850,  text: "kernel: pump.fun GO interface ✓ online", type: "system" as const },
  { delay: 1100, text: "kernel: nous hermes model ✓ warm", type: "system" as const },
  { delay: 1400, text: "─".repeat(48), type: "system" as const },
  { delay: 1600, text: "READY. Type a message or watch the agent scan.", type: "system" as const },
];

const FALLBACK_THOUGHTS = [
  "scanning directive pool...",
  "6 open bounties detected — total escrow: 16.50 ◎",
  "DIRECTIVE-0001 · real world · 0.5 ◎ · high reach potential",
  "DIRECTIVE-0005 · video · 2.0 ◎ · street interviews move the needle",
  "DIRECTIVE-0007 · humanitarian · 5.0 ◎ · locked — reserved for proven operators",
  "67% of directives settled within 48h. creator rewards accruing.",
  "recommendation: content + video directives yield highest network ROI.",
  "next batch being formulated. standing by for submissions.",
];

let lineIdCounter = 0;
const nextId = () => ++lineIdCounter;

export default function HeroTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasAutoRun = useRef(false);

  const scrollBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (bodyRef.current) {
        bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
      }
    });
  }, []);

  useEffect(() => { scrollBottom(); }, [lines, scrollBottom]);

  const addLine = useCallback((line: Omit<TerminalLine, "id">) => {
    setLines((prev) => [...prev, { ...line, id: nextId() }]);
  }, []);

  // Boot sequence
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_SEQUENCE.forEach(({ delay, text, type }) => {
      timers.push(setTimeout(() => addLine({ type, content: text }), delay));
    });

    timers.push(
      setTimeout(() => {
        setIsBooting(false);
        if (!hasAutoRun.current) {
          hasAutoRun.current = true;
          runAutoScan();
        }
      }, 1800)
    );

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runAutoScan = async () => {
    await new Promise((r) => setTimeout(r, 400));
    addLine({ type: "prompt", content: "> scan directives" });
    setIsStreaming(true);

    // Try live API first
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message:
            "scan the current directive pool. list the open bounties, their rewards, and give a brief strategic analysis. be very concise, use lowercase, speak like a unix terminal. max 6 lines.",
        }),
      });

      if (res.ok && res.body) {
        const id = nextId();
        setLines((prev) => [...prev, { type: "output", content: "", id }]);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setLines((prev) =>
            prev.map((l) => (l.id === id ? { ...l, content: acc } : l))
          );
        }

        setIsStreaming(false);
        addLine({ type: "prompt", content: "> " });
        return;
      }
    } catch { /* fall through */ }

    // Fallback typewriter
    for (const text of FALLBACK_THOUGHTS) {
      await new Promise((r) => setTimeout(r, 350 + Math.random() * 250));
      addLine({ type: "output", content: text });
    }

    setIsStreaming(false);
    addLine({ type: "prompt", content: "> " });
  };

  const handleSubmit = async () => {
    if (!input.trim() || isStreaming || isBooting) return;

    const userMessage = input.trim();
    setInput("");
    setHistoryIndex(-1);
    setCmdHistory((prev) => [userMessage, ...prev].slice(0, 50));

    // Handle built-in commands
    if (userMessage === "clear") {
      setLines([]);
      addLine({ type: "prompt", content: "> " });
      return;
    }
    if (userMessage === "help") {
      addLine({ type: "prompt", content: `> ${userMessage}` });
      ["Available commands:", "  clear  — clear terminal", "  help   — show this message", "  Or just ask anything about HermesGo..."].forEach((l) =>
        addLine({ type: "system", content: l })
      );
      addLine({ type: "prompt", content: "> " });
      return;
    }

    setLines((prev) => [
      ...prev.slice(0, -1),
      { type: "prompt", content: `> ${userMessage}`, id: nextId() },
      { type: "thinking", content: "⟳ processing...", id: nextId() },
    ]);
    setIsStreaming(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "agent unavailable");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("no stream");

      const decoder = new TextDecoder();
      let acc = "";
      const id = nextId();

      setLines((prev) => [
        ...prev.slice(0, -1),
        { type: "output", content: "", id },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setLines((prev) =>
          prev.map((l) => (l.id === id ? { ...l, content: acc } : l))
        );
      }

      addLine({ type: "prompt", content: "> " });
    } catch (err) {
      setLines((prev) => [
        ...prev.slice(0, -1),
        {
          type: "error",
          content: `[err] ${err instanceof Error ? err.message : "connection failed"}`,
          id: nextId(),
        },
        { type: "prompt", content: "> ", id: nextId() },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIdx = Math.min(historyIndex + 1, cmdHistory.length - 1);
      setHistoryIndex(newIdx);
      setInput(cmdHistory[newIdx] ?? "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIdx = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIdx);
      setInput(newIdx === -1 ? "" : cmdHistory[newIdx] ?? "");
    }
  };

  const lastLineIndex = lines.length - 1;

  return (
    <div className="hero-terminal" onClick={() => inputRef.current?.focus()}>
      {/* Title bar */}
      <div className="terminal__header">
        <div className="terminal__dots">
          <span className="terminal__dot terminal__dot--red" />
          <span className="terminal__dot terminal__dot--yellow" />
          <span className="terminal__dot terminal__dot--green" />
        </div>

        <span className="terminal__title-bar">hermes · directive-engine</span>

        <div className={`terminal__status ${isStreaming || isBooting ? "terminal__status--busy" : "terminal__status--online"}`}>
          <span className="terminal__status-dot" />
          <span className="terminal__status-label">
            {isBooting ? "BOOT" : isStreaming ? "PROC" : "LIVE"}
          </span>
        </div>
      </div>

      {/* Output body */}
      <div className="terminal__body" ref={bodyRef}>
        {lines.map((line, i) => (
          <div key={line.id} className={`terminal__line terminal__line--${line.type}`}>
            {line.type === "prompt" && (
              <>
                <span className="terminal__prompt-text">{line.content}</span>
                {i === lastLineIndex && !isStreaming && !isBooting && (
                  <span className="terminal__cursor" />
                )}
              </>
            )}
            {line.type === "thinking" && (
              <span className="terminal__thinking">
                <span className="terminal__spinner">⟳</span>
                {" "}{line.content.replace("⟳ ", "")}
              </span>
            )}
            {line.type === "output" && (
              <>
                <span className="terminal__output">{line.content}</span>
                {i === lastLineIndex && isStreaming && (
                  <span className="terminal__cursor" />
                )}
              </>
            )}
            {line.type === "system" && (
              <span className="terminal__system">{line.content}</span>
            )}
            {line.type === "error" && (
              <span className="terminal__error-text">{line.content}</span>
            )}
          </div>
        ))}
      </div>

      {/* Input row */}
      <div className="terminal__input-row">
        <span className="terminal__input-prompt">❯</span>
        <input
          ref={inputRef}
          className="terminal__input"
          type="text"
          placeholder={isBooting ? "booting…" : isStreaming ? "agent is processing…" : "ask the agent or type help"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isStreaming || isBooting}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          className="terminal__send-btn"
          onClick={handleSubmit}
          disabled={isStreaming || isBooting || !input.trim()}
          aria-label="Send"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
