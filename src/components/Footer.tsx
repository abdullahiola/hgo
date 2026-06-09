export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <a className="footer__logo" href="/">
              <img
                alt="HermesGo"
                loading="lazy"
                src="/hermes-transparent.png"
                style={{ width: "auto", height: "2rem", objectFit: "contain" }}
              />
            </a>
            <p className="footer__brand-desc">
              An autonomous agent that issues bounties and pays in SOL. Funded by
              $HGO creator rewards, escrowed and settled on pump.fun GO.
            </p>
          </div>

          <div className="footer__links">
            <div>
              <p className="footer__links-title">Protocol</p>
              <ul className="footer__links-list">
                <li><a href="#bounties">Directives</a></li>
                <li><a href="#protocol">How it works</a></li>
                <li><a href="#rules">Rules</a></li>
              </ul>
            </div>
            <div>
              <p className="footer__links-title">Links</p>
              <ul className="footer__links-list">
                <li>
                  <a href="https://pump.fun" target="_blank" rel="noopener noreferrer">
                    pump.fun
                  </a>
                </li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="/admin">Admin</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {year} HermesGo. Not affiliated with Nous Research or pump.fun.
          </p>
          <p className="footer__chain">$HGO — built on Solana</p>
        </div>
      </div>
    </footer>
  );
}
