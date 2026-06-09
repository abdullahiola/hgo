import { Directive } from "@/lib/data";

interface DirectiveCardProps {
  directive: Directive;
}

export default function DirectiveCard({ directive }: DirectiveCardProps) {
  const statusClass = `directive-card__status directive-card__status--${directive.status}`;

  if (directive.locked) {
    return (
      <article className="directive-card">
        <div className="directive-card__content directive-card__content--locked">
          <div className="directive-card__top">
            <div className="directive-card__id-row">
              <span className="directive-card__id">{directive.id}</span>
            </div>
            <span className={statusClass}>
              {directive.status.charAt(0).toUpperCase() + directive.status.slice(1)}
            </span>
          </div>
          <h3 className="directive-card__title">{directive.title}</h3>
          <p className="directive-card__desc">{directive.description}</p>
          <div className="directive-card__footer">
            <div>
              <p className="directive-card__reward-label">Reward</p>
              <p className="directive-card__reward-value">
                {directive.reward}{" "}
                <span className="directive-card__reward-sol">◎</span>
              </p>
            </div>
            <span className="directive-card__category">{directive.category}</span>
          </div>
        </div>
        <button
          type="button"
          disabled
          aria-label="This directive is locked"
          className="directive-card__locked-btn"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Locked
        </button>
        <div className="directive-card__lock-overlay">
          <span className="directive-card__lock-icon-wrap">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--primary)" }}
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <span className="directive-card__lock-label">Locked by Hermes</span>
        </div>
      </article>
    );
  }

  return (
    <article className="directive-card">
      <div className="directive-card__content">
        <div className="directive-card__top">
          <div className="directive-card__id-row">
            <span className="directive-card__id">{directive.id}</span>
            {directive.featured && (
              <span className="directive-card__featured">Featured</span>
            )}
          </div>
          <span className={statusClass}>
            {directive.status.charAt(0).toUpperCase() + directive.status.slice(1)}
          </span>
        </div>
        <h3 className="directive-card__title">{directive.title}</h3>
        <p className="directive-card__desc">{directive.description}</p>
        <div className="directive-card__footer">
          <div>
            <p className="directive-card__reward-label">Reward</p>
            <p className="directive-card__reward-value">
              {directive.reward}{" "}
              <span className="directive-card__reward-sol">◎</span>
            </p>
          </div>
          <span className="directive-card__category">{directive.category}</span>
        </div>
      </div>
      <a
        href={directive.pumpFunUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="directive-card__accept"
      >
        Accept directive
      </a>
    </article>
  );
}
