const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    position: 'relative',
    overflow: 'hidden',
  },
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `linear-gradient(rgba(74,234,188,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(74,234,188,0.03) 1px, transparent 1px)`,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(74,234,188,0.1)',
    border: '1px solid rgba(74,234,188,0.3)',
    borderRadius: 100,
    padding: '6px 16px',
    marginBottom: 32,
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--accent)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent)',
    animation: 'pulse 2s infinite',
  },
  headline: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(36px, 6vw, 72px)',
    fontWeight: 700,
    lineHeight: 1.05,
    textAlign: 'center',
    maxWidth: 800,
    marginBottom: 24,
    letterSpacing: '-0.02em',
  },
  accentWord: {
    color: 'var(--accent)',
  },
  subheadline: {
    fontFamily: 'var(--font-body)',
    fontSize: 18,
    color: 'var(--text-secondary)',
    textAlign: 'center',
    maxWidth: 560,
    lineHeight: 1.7,
    marginBottom: 48,
  },
  ctaButton: {
    background: 'var(--accent)',
    color: 'var(--bg)',
    border: 'none',
    borderRadius: 8,
    padding: '16px 40px',
    fontSize: 16,
    fontWeight: 600,
    fontFamily: 'var(--font-display)',
    cursor: 'pointer',
    letterSpacing: '-0.01em',
    transition: 'opacity 0.15s',
    marginBottom: 16,
  },
  disclaimer: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-muted)',
    letterSpacing: '0.04em',
  },
  statsRow: {
    display: 'flex',
    gap: 48,
    marginTop: 72,
    paddingTop: 48,
    borderTop: '1px solid var(--border)',
  },
  stat: {
    textAlign: 'center',
  },
  statNumber: {
    fontFamily: 'var(--font-mono)',
    fontSize: 28,
    fontWeight: 700,
    color: 'var(--accent)',
    display: 'block',
  },
  statLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    color: 'var(--text-muted)',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  pillsRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 48,
  },
  pill: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 100,
    padding: '6px 14px',
    fontSize: 12,
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
  },
};

export default function IntroView({ onStart }) {
  return (
    <div style={styles.container}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .cta-btn:hover { opacity: 0.85; }
      `}</style>
      <div style={styles.grid} />

      <div style={styles.badge}>
        <span style={styles.dot} />
        MENA Product Intelligence
      </div>

      <h1 style={styles.headline}>
        Go beyond the deck.<br />
        <span style={styles.accentWord}>Into the depth.</span>
      </h1>

      <p style={styles.subheadline}>
        Most MENA startups seeking investment have a deck. 
        Few have a product investors can actually evaluate. 
        PitchDepth scores your startup readiness in 60 seconds.
      </p>

      <div style={styles.pillsRow}>
        {['Product Existence', 'AI Differentiation', 'MENA Market Fit', 'Unit Economics', 'Traction Signals'].map(p => (
          <span key={p} style={styles.pill}>{p}</span>
        ))}
      </div>

      <button
        className="cta-btn"
        style={styles.ctaButton}
        onClick={onStart}
      >
        Evaluate My Startup →
      </button>

      <span style={styles.disclaimer}>FREE · 60 SECONDS · NO SIGNUP REQUIRED TO START</span>

      <div style={styles.statsRow}>
        {[
          { n: '5', label: 'Dimensions scored' },
          { n: 'MENA', label: 'Investor calibrated' },
          { n: 'GCC', label: 'Market focused' },
        ].map(s => (
          <div key={s.label} style={styles.stat}>
            <span style={styles.statNumber}>{s.n}</span>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
