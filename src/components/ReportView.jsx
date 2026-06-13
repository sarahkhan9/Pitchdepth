import { useState, useEffect } from 'react';

const STATUS_CONFIG = {
  strong: { color: 'var(--accent)', bg: 'var(--accent-dim)', label: 'STRONG', icon: '●' },
  'needs-work': { color: 'var(--amber)', bg: 'var(--amber-dim)', label: 'NEEDS WORK', icon: '◐' },
  critical: { color: 'var(--red)', bg: 'var(--red-dim)', label: 'CRITICAL GAP', icon: '○' },
};

const BAND_COLORS = {
  'Investor Ready': 'var(--accent)',
  'Nearly There': 'var(--accent)',
  'Early Stage': 'var(--amber)',
  'Not Ready': 'var(--red)',
};

function AnimatedScore({ target, duration = 1800 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return display;
}

function ScoreBar({ score, maxScore, color }) {
  const [width, setWidth] = useState(0);
  const pct = (score / maxScore) * 100;

  useEffect(() => {
    setTimeout(() => setWidth(pct), 100);
  }, [pct]);

  return (
    <div style={{ height: 4, background: 'var(--surface)', borderRadius: 2, overflow: 'hidden', flex: 1 }}>
      <div style={{
        height: '100%',
        width: `${width}%`,
        background: color,
        borderRadius: 2,
        transition: 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
      }} />
    </div>
  );
}

export default function ReportView({ report, onReset }) {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const bandColor = BAND_COLORS[report.band] || 'var(--accent)';


  const handleDownload = () => {
    const company = (report.companyName) || (report.submittedData && report.submittedData.companyName) || 'startup';
    const nl = '\n';
    const sep = '==================================================';
    const dims = (report.dimensions || []).map(function(d) { return d.name + ': ' + d.score + '/' + d.maxScore + nl + '  ' + d.why + nl + '  GCC: ' + d.menaContext; }).join(nl + nl);
    const fixes = (report.topFixes || []).map(function(f) { return f.priority + '. ' + f.action + nl + '   ' + f.whyItMatters; }).join(nl + nl);
    const text = ['PITCHDEPTH REPORT', sep, 'Company: ' + company, 'Score: ' + report.overallScore + '/100', 'Band: ' + report.band, '', 'BIGGEST RISK', report.biggestRisk, '', 'DIMENSIONS', dims, '', 'FIXES', fixes, '', report.curiosityHook, '', 'https://sarahkhan.app'].join(nl);
    const blob = new Blob([text], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'pitchdepth-report.txt'; a.click();
    URL.revokeObjectURL(url);
  };
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 24px', maxWidth: 760, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
          PITCHDEPTH / REPORT
        </div>
        <button
          onClick={onReset}
          style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 14px', color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-body)', cursor: 'pointer' }}
        >
          ← New Evaluation
        </button>
      </div>

      {/* Score Hero */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '40px',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 200, height: 200,
          background: `radial-gradient(circle, ${bandColor}15 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 6 }}>
            EVALUATION REPORT
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
            {report.companyName || report.submittedData?.companyName}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
          {/* Big score */}
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 88,
              fontWeight: 700,
              lineHeight: 1,
              color: bandColor,
              letterSpacing: '-0.04em',
            }}>
              <AnimatedScore target={report.overallScore} />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>/ 100</div>
          </div>

          {/* Band + description */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{
              display: 'inline-block',
              background: `${bandColor}18`,
              border: `1px solid ${bandColor}40`,
              borderRadius: 6,
              padding: '4px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: bandColor,
              letterSpacing: '0.06em',
              marginBottom: 10,
            }}>
              {report.band?.toUpperCase()}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
              {report.bandDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Biggest Risk */}
      <div style={{
        background: 'var(--red-dim)',
        border: '1px solid rgba(255,77,77,0.25)',
        borderRadius: 12,
        padding: '16px 20px',
        marginBottom: 24,
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 16, marginTop: 1 }}>⚠</span>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--red)', letterSpacing: '0.08em', marginBottom: 4 }}>
            BIGGEST RISK TO YOUR RAISE
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {report.biggestRisk}
          </p>
        </div>
      </div>

      {/* Dimension Breakdown */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '32px',
        marginBottom: 24,
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 24 }}>
          DIMENSION BREAKDOWN
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {report.dimensions?.map((dim, i) => {
            const cfg = STATUS_CONFIG[dim.status] || STATUS_CONFIG['needs-work'];
            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: cfg.color, fontSize: 12 }}>{cfg.icon}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>
                      {dim.name}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      color: cfg.color,
                      background: cfg.bg,
                      padding: '2px 8px',
                      borderRadius: 4,
                      letterSpacing: '0.06em',
                    }}>
                      {cfg.label}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: cfg.color, fontWeight: 700 }}>
                    {dim.score}/{dim.maxScore}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <ScoreBar score={dim.score} maxScore={dim.maxScore} color={cfg.color} />
                </div>

                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 6 }}>
                  {dim.why}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, fontStyle: 'italic' }}>
                  GCC investor view: {dim.menaContext}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 3 Fixes */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '32px',
        marginBottom: 24,
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 24 }}>
          PRIORITY FIXES
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {report.topFixes?.map((fix, i) => (
            <div key={i} style={{ display: 'flex', gap: 16 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: i === 0 ? 'var(--accent-dim)' : 'var(--surface-raised)',
                border: `1px solid ${i === 0 ? 'var(--border-accent)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: i === 0 ? 'var(--accent)' : 'var(--text-muted)',
                flexShrink: 0, marginTop: 2,
              }}>
                {fix.priority}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.5 }}>
                  {fix.action}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {fix.whyItMatters}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Curiosity Hook / CTA */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(74,234,188,0.08) 0%, rgba(74,234,188,0.03) 100%)',
        border: '1px solid var(--border-accent)',
        borderRadius: 16,
        padding: '32px',
        marginBottom: 24,
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.08em', marginBottom: 12 }}>
          DEEPER ASSESSMENT AVAILABLE
        </div>
        <p style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: 20 }}>
          {report.curiosityHook}
        </p>
        <a
          href="https://sarahkhan.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            background: 'var(--accent)',
            color: 'var(--bg)',
            borderRadius: 8,
            padding: '12px 28px',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'var(--font-display)',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}
        >
          Book a Product Assessment →
        </a>
      </div>

      {/* Share */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
          PITCHDEPTH · MENA PRODUCT INTELLIGENCE
        </div>
        <button
          onClick={handleShare}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: '8px 16px',
            color: copied ? 'var(--accent)' : 'var(--text-secondary)',
            fontSize: 12,
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {copied ? '✓ Link copied' : 'Share this report'}
          </button>
          <button onClick={handleDownload} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:6,padding:'8px 16px',color:'var(--text-secondary)',fontSize:12,fontFamily:'var(--font-body)',cursor:'pointer'}}>
            {'Download Report'}
        </button>
      </div>
    </div>
  );
}
