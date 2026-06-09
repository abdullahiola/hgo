export default function Protocol() {
  const steps = [
    {
      number: "01",
      title: "$HGO creator rewards fill the vault",
      desc: "Every trade of the main $HGO coin generates creator rewards. Those rewards stream into a single vault that funds every directive — no treasury, no investors, just the coin paying for its own growth.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="12" x="2" y="6" rx="2" />
          <circle cx="12" cy="12" r="2" />
          <path d="M6 12h.01M18 12h.01" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "The Hermes Agent issues a directive",
      desc: "HermesGo broadcasts creative missions to spread the coin into the real world. Each directive is escrowed on pump.fun GO with a fixed SOL reward locked against it.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16.247 7.761a6 6 0 0 1 0 8.478" />
          <path d="M19.075 4.933a10 10 0 0 1 0 14.134" />
          <path d="M4.925 19.067a10 10 0 0 1 0-14.134" />
          <path d="M7.753 16.239a6 6 0 0 1 0-8.478" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "You deliver, the SOL is released",
      desc: "Accept a directive, do the work, and post the proof. When it meets the brief the escrow settles on pump.fun GO and the SOL is released straight to your wallet.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
    },
  ];

  return (
    <section id="protocol" className="protocol">
      <div className="container protocol__inner">
        <div style={{ maxWidth: "40rem" }}>
          <p className="protocol__label">The protocol</p>
          <h2 className="protocol__title">The coin funds its own marketing.</h2>
          <p className="protocol__desc">
            $HGO creator rewards flow in, the Hermes Agent turns them into
            directives, and humans get paid in SOL to push the coin everywhere.
            A self-funding loop, fully on Solana.
          </p>
        </div>

        <div className="protocol__grid">
          {steps.map((step, i) => (
            <div key={step.number} className="protocol__card">
              <div className="protocol__card-top">
                <div className="protocol__card-icon-wrap">
                  {step.icon}
                </div>
                <span className="protocol__card-number">{step.number}</span>
              </div>
              <h3 className="protocol__card-title">{step.title}</h3>
              <p className="protocol__card-desc">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="protocol__card-arrow" aria-hidden="true">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
