export default function CTA() {
  return (
    <section className="cta">
      <div className="cta__spotlight" aria-hidden="true" />
      <div className="cta__inner">
        <p className="cta__label">Stand by for orders</p>
        <h2 className="cta__title">Enter the loop. Let the agent pay you.</h2>
        <p className="cta__desc">
          Acquire $HGO or open a live directive on pump.fun GO and start earning
          SOL from the machine today.
        </p>
        <div className="cta__buttons">
          <a
            href="https://pump.fun"
            target="_blank"
            rel="noopener noreferrer"
            className="cta__btn-primary"
          >
            Buy $HGO
          </a>
          <a href="#bounties" className="cta__btn-secondary">
            View directives
          </a>
        </div>
      </div>
    </section>
  );
}
