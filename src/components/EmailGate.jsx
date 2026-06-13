import { useState } from 'react';

export default function EmailGate({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isValid = email.includes('@') && email.includes('.');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    onSubmit(email);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56,
          background: 'var(--accent-dim)',
          border: '1px solid var(--border-accent)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px',
          fontSize: 24,
        }}>
          📊
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          marginBottom: 12,
        }}>
          Your report is ready
        </h2>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 36, fontSize: 15 }}>
          Enter your email to view your PitchDepth score. We'll also send you a copy so you can share it with investors.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '14px 16px',
              color: 'var(--text-primary)',
              fontSize: 15,
              outline: 'none',
              marginBottom: 12,
              textAlign: 'center',
              fontFamily: 'var(--font-body)',
            }}
            autoFocus
          />

          <button
            type="submit"
            disabled={!isValid || submitting}
            style={{
              width: '100%',
              background: isValid ? 'var(--accent)' : 'var(--surface)',
              color: isValid ? 'var(--bg)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 8,
              padding: '14px',
              fontSize: 15,
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
              cursor: isValid ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
            }}
          >
            {submitting ? 'Running evaluation...' : 'View My Score →'}
          </button>
        </form>

        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 16, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
          NO SPAM · UNSUBSCRIBE ANYTIME · YOUR DATA IS PRIVATE
        </p>
      </div>
    </div>
  );
}
