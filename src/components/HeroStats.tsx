"use client";

import { useState, useEffect } from "react";

interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

export default function HeroStats() {
  const [stats, setStats] = useState<Stat[]>([
    { value: "—", label: "Directives issued" },
    { value: "—", label: "Open now" },
    { value: "—", label: "Escrowed rewards", suffix: "◎" },
  ]);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setStats(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="hero__stats">
      {stats.map((stat) => (
        <div key={stat.label} className="hero__stat">
          <p className="hero__stat-value">
            {stat.value}
            {stat.suffix && (
              <span style={{ fontSize: "1rem", marginLeft: 4, color: "var(--muted)" }}>
                {stat.suffix}
              </span>
            )}
          </p>
          <p className="hero__stat-label">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
