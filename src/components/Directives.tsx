"use client";

import { useState, useEffect } from "react";
import { type DirectiveStatus, type Directive } from "@/lib/data";
import DirectiveCard from "./DirectiveCard";

type FilterType = "all" | DirectiveStatus;

export default function Directives() {
  const [directives, setDirectives] = useState<Directive[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  useEffect(() => {
    fetch("/api/directives")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setDirectives(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Open", value: "open" },
    { label: "Claimed", value: "claimed" },
    { label: "Settled", value: "settled" },
  ];

  const filtered =
    activeFilter === "all"
      ? directives
      : directives.filter((d) => d.status === activeFilter);

  return (
    <section id="bounties" className="directives">
      <div className="container directives__inner">
        <div className="directives__header">
          <div>
            <p className="directives__label">Live transmission</p>
            <h2 className="directives__title">Directives</h2>
            <p className="directives__subtitle">
              Directives issued by the agent. Each one is escrowed and settled on
              pump.fun GO — accept one, deliver the work, and the SOL is released
              to your wallet.
            </p>
          </div>
          <div className="directives__filters">
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setActiveFilter(f.value)}
                className={`directives__filter-btn${
                  activeFilter === f.value ? " directives__filter-btn--active" : ""
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="directives__grid">
          {loading ? (
            <p style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}>
              Loading directives…
            </p>
          ) : filtered.length === 0 ? (
            <p style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}>
              No directives match this filter.
            </p>
          ) : (
            filtered.map((directive) => (
              <DirectiveCard key={directive.id} directive={directive} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
