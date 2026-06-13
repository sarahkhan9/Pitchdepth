import { useState, useEffect } from 'react';

const MESSAGES = [
  'Scanning product existence...',
  'Evaluating AI differentiation...',
  'Assessing MENA market fit...',
  'Checking unit economics...',
  'Calibrating against GCC investor criteria...',
  'Generating your PitchDepth report...',
];

export default function LoadingView() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length);
    }, 2200);
    const dotTimer = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 400);
    return () => { clearInterval(msgTimer); clearInterval(dotTimer); };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      gap: 32,
    }}>
      {/* Terminal-style loader */}
      <div style={{
        width: 80, height: 80,
        border: '2px solid var(--border)',
        borderTop: '2px solid var(--accent)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: 'var(--accent)',
          letterSpacing: '0.04em',
          minHeight: 24,
        }}>
          {MESSAGES[msgIndex]}{dots}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, fontFamily: 'var(--font-body)' }}>
          Calibrating against MENA investor criteria
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        width: 240,
        height: 2,
        background: 'var(--surface)',
        borderRadius: 1,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: 'var(--accent)',
          animation: 'progress 14s linear forwards',
          width: 0,
        }} />
      </div>
      <style>{`@keyframes progress { to { width: 100%; } }`}</style>
    </div>
  );
}
