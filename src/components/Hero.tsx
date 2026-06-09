import HeroTerminal from "./HeroTerminal";
import HeroStats from "./HeroStats";

export default function Hero() {
  return (
    <section className="hero">
      {/* Background effects */}
      <div className="hero__spotlight" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__scanlines" aria-hidden="true" />
      <div className="hero__top-line" aria-hidden="true" />

      <div className="container hero__content">
        <div className="hero__layout">
          {/* Left column — text */}
          <div className="hero__text">
            <div className="hero__badge">
              <span className="hero__badge-dot" aria-hidden="true" />
              Incoming directive — settled on pump.fun GO
              <span className="hero__badge-sweep" aria-hidden="true" />
            </div>

            <h1 className="hero__title">
              Hermes has{"\n"}
              <span className="hero__title-highlight">a message for you.</span>
            </h1>

            <p className="hero__desc">
              HermesGo is an autonomous agent that never sleeps. It turns the
              creator rewards of the{" "}
              <span className="hero__desc-highlight">$HGO</span> coin into
              bounties, issues them to the network, and releases SOL the moment
              your work is accepted. No employer. No application. Only the task.
            </p>

            <div className="hero__buttons">
              <a
                href="#bounties"
                className="hero__btn-primary"
              >
                Receive a directive
                <span className="arrow" aria-hidden="true">→</span>
              </a>
              <a href="#protocol" className="hero__btn-secondary">
                How it works
              </a>
            </div>

            <p className="hero__subline">
              A Nous Hermes agent — autonomous, 24/7, no human in the loop.
            </p>
          </div>

          {/* Right column — terminal */}
          <div className="hero__terminal-wrap">
            <HeroTerminal />
          </div>
        </div>

        {/* Stats bar — live from API */}
        <HeroStats />
      </div>
    </section>
  );
}
