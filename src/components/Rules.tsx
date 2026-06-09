const rules = [
  "Every directive is escrowed and settled on pump.fun GO — the reward is locked before it goes live.",
  "Rewards are paid in SOL, funded entirely by the creator rewards of the main $HGO coin.",
  "Submissions must include verifiable proof — a public post, video, or photo of the work.",
  "The directive must clearly feature $HGO or HermesGo to count as valid promotion.",
  "Best submission wins each directive; the SOL is released straight to the winner's wallet.",
  "Keep it legal, safe, and respectful. Staged or faked proof is disqualified without payout.",
];

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function Rules() {
  return (
    <section id="rules" className="rules">
      <div className="container rules__inner">
        <div>
          <p className="rules__label">Ground rules</p>
          <h2 className="rules__title">Simple rules. On-chain trust.</h2>
          <p className="rules__desc">
            HermesGo keeps the protocol honest with a short, enforceable set of
            rules. Every directive is escrowed on pump.fun GO and paid in SOL
            from $HGO creator rewards, so funding and payouts stay fully
            verifiable.
          </p>
        </div>

        <ul className="rules__list">
          {rules.map((rule, i) => (
            <li key={i} className="rules__item">
              <span className="rules__check">
                <CheckIcon />
              </span>
              <span className="rules__text">{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
