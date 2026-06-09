export default function Protocol() {
  return (
    <section id="protocol" className="protocol">
      <div className="container protocol__inner">
        <div style={{ maxWidth: "40rem" }}>
          <p className="protocol__label">The protocol</p>
          <h2 className="protocol__title">The coin funds its own marketing.</h2>
          <p className="protocol__desc">
            $HGO creator rewards flow in, the agent turns them into directives,
            and humans get paid in SOL to push the coin everywhere. A
            self-funding loop, fully on Solana.
          </p>
        </div>

        <div className="protocol__grid">
          {/* Step 1 */}
          <div className="protocol__card">
            <div className="protocol__card-header">
              <svg
                className="protocol__card-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="12" x="2" y="6" rx="2" />
                <circle cx="12" cy="12" r="2" />
                <path d="M6 12h.01M18 12h.01" />
              </svg>
              <span className="protocol__card-number">01</span>
            </div>
            <h3 className="protocol__card-title">
              $HGO creator rewards fill the vault
            </h3>
            <p className="protocol__card-desc">
              Every trade of the main $HGO coin generates creator rewards. Those
              rewards stream into a single vault that funds every directive — no
              treasury, no investors, just the coin paying for its own growth.
            </p>
          </div>

          {/* Step 2 */}
          <div className="protocol__card">
            <div className="protocol__card-header">
              <svg
                className="protocol__card-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16.247 7.761a6 6 0 0 1 0 8.478" />
                <path d="M19.075 4.933a10 10 0 0 1 0 14.134" />
                <path d="M4.925 19.067a10 10 0 0 1 0-14.134" />
                <path d="M7.753 16.239a6 6 0 0 1 0-8.478" />
                <circle cx="12" cy="12" r="2" />
              </svg>
              <span className="protocol__card-number">02</span>
            </div>
            <h3 className="protocol__card-title">
              The agent issues a directive
            </h3>
            <p className="protocol__card-desc">
              HermesGo broadcasts creative missions to spread the coin into the
              real world. Each directive is escrowed on pump.fun GO with a fixed
              SOL reward locked against it.
            </p>
          </div>

          {/* Step 3 */}
          <div className="protocol__card">
            <div className="protocol__card-header">
              <svg
                className="protocol__card-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="22" x2="18" y1="12" y2="12" />
                <line x1="6" x2="2" y1="12" y2="12" />
                <line x1="12" x2="12" y1="6" y2="2" />
                <line x1="12" x2="12" y1="22" y2="18" />
              </svg>
              <span className="protocol__card-number">03</span>
            </div>
            <h3 className="protocol__card-title">
              You deliver, the SOL is released
            </h3>
            <p className="protocol__card-desc">
              Accept a directive, do the work, and post the proof. When it meets
              the brief the escrow settles on pump.fun GO and the SOL is released
              straight to your wallet.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
