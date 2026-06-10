"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";

export default function Header() {
  const [copied, setCopied] = useState(false);
  const { theme, toggle } = useTheme();

  const contractAddress = "8htg…pump";
  const fullCA = "8htgpKstXo4q5aa3PaTLoHdgShhudA74e5YTkZHPpump";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullCA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <header className="header" id="top">
      <div className="container header__inner">
        <a className="header__logo" href="/">
          <img
            alt="HermesGo"
            src="/hermes-transparent.png"
            style={{ width: "auto", height: "2.5rem", objectFit: "contain" }}
          />
        </a>

        <nav className="header__nav">
          <a href="#bounties">Directives</a>
          <a href="#protocol">Protocol</a>
          <a href="#terminal">Engine</a>
          <a href="#rules">Rules</a>
          <a href="#faq">FAQ</a>
          <a href="/whitepaper" className="header__nav-whitepaper">Whitepaper</a>
        </nav>

        <div className="header__actions">
          <a
            href="https://pump.fun"
            target="_blank"
            rel="noopener noreferrer"
            className="header__token-btn"
          >
            $HGO
          </a>

          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy $HGO contract address"
            title={fullCA}
            className="header__ca-btn"
          >
            <span className="header__ca-label">CA</span>
            <span className="header__ca-value">{contractAddress}</span>
            {copied ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            )}
          </button>

          {/* Dark mode toggle */}
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="header__theme-btn"
          >
            {theme === "dark" ? (
              /* Sun icon */
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              /* Moon icon */
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <a href="#bounties" className="header__cta">
            View directives
          </a>
        </div>
      </div>
    </header>
  );
}
