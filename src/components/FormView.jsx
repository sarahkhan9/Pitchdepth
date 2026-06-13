import { useState, useRef } from 'react';
import { extractTextFromPDF } from '../pdfUtils';

const inputStyle = {
  width: '100%',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: '12px 16px',
  color: 'var(--text-primary)',
  fontSize: 15,
  outline: 'none',
  transition: 'border-color 0.15s',
  fontFamily: 'var(--font-body)',
};

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  color: 'var(--text-muted)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: 8,
};

const fieldStyle = { marginBottom: 24 };

const STAGES = ['Idea', 'MVP', 'Live Product', 'Post-Revenue', 'Series A+'];
const INVESTORS = ['Angel / Pre-Seed', 'Seed VC', 'Series A VC', 'Strategic / Corporate', 'Government / Grant'];

export default function FormView({ onSubmit, error }) {
  const [form, setForm] = useState({
    companyName: '',
    description: '',
    stage: '',
    productLink: '',
    noProduct: false,
    targetInvestor: '',
    deckText: '',
  });
  const [focused, setFocused] = useState(null);
  const [deckFile, setDeckFile] = useState(null);
  const [deckParsing, setDeckParsing] = useState(false);
  const [deckParsed, setDeckParsed] = useState(false);
  const [deckError, setDeckError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const isValid = form.companyName && form.description && form.stage && form.targetInvestor;

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setDeckError('Please upload a PDF file.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setDeckError('File too large. Please upload a PDF under 20MB.');
      return;
    }

    setDeckFile(file);
    setDeckParsing(true);
    setDeckError(null);
    setDeckParsed(false);

    try {
      const text = await extractTextFromPDF(file);
      set('deckText', text);
      setDeckParsed(true);
    } catch (err) {
      setDeckError('Could not read this PDF. Try pasting your deck content below instead.');
    } finally {
      setDeckParsing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileInput = (e) => {
    handleFile(e.target.files[0]);
  };

  const removeFile = () => {
    setDeckFile(null);
    setDeckParsed(false);
    setDeckError(null);
    set('deckText', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit(form);
  };

  const focusStyle = (name) => focused === name ? { borderColor: 'var(--accent)' } : {};

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 24px' }}>
      <div style={{ width: '100%', maxWidth: 640 }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
            PITCHDEPTH / EVALUATE
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
            Tell us about your startup
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6 }}>
            Be honest — the more accurate your submission, the more useful your score.
          </p>
        </div>

        {error && (
          <div style={{ background: 'var(--red-dim)', border: '1px solid var(--red)', borderRadius: 8, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: 'var(--red)' }}>
            Something went wrong: {error}. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Company Name */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Company Name *</label>
            <input
              style={{ ...inputStyle, ...focusStyle('name') }}
              placeholder="Your startup name"
              value={form.companyName}
              onChange={e => set('companyName', e.target.value)}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
            />
          </div>

          {/* One-liner */}
          <div style={fieldStyle}>
            <label style={labelStyle}>One-Line Description *</label>
            <input
              style={{ ...inputStyle, ...focusStyle('desc') }}
              placeholder="What does your startup do? (one clear sentence)"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              onFocus={() => setFocused('desc')}
              onBlur={() => setFocused(null)}
            />
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
              Tip: If you can't say it in one sentence, that's your first gap.
            </div>
          </div>

          {/* Stage */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Current Stage *</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {STAGES.map(s => (
                <button key={s} type="button" onClick={() => set('stage', s)}
                  style={{
                    padding: '8px 16px', borderRadius: 6, border: '1px solid',
                    borderColor: form.stage === s ? 'var(--accent)' : 'var(--border)',
                    background: form.stage === s ? 'var(--accent-dim)' : 'var(--surface)',
                    color: form.stage === s ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: 13, fontFamily: 'var(--font-body)', cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Deck Upload — CORE FEATURE */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Pitch Deck *
              <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', fontSize: 11, marginLeft: 6 }}>
                PDF upload
              </span>
            </label>

            {!deckFile ? (
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? 'var(--accent)' : 'rgba(240,244,255,0.15)'}`,
                  borderRadius: 10,
                  padding: '36px 24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: dragOver ? 'var(--accent-dim)' : 'transparent',
                  transition: 'all 0.15s',
                }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>📄</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>
                  Drop your pitch deck here
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
                  or click to browse
                </div>
                <div style={{
                  display: 'inline-block',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  padding: '8px 18px',
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.04em',
                }}>
                  PDF · MAX 20MB
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                />
              </div>
            ) : (
              <div style={{
                background: 'var(--surface)',
                border: `1px solid ${deckParsed ? 'var(--border-accent)' : deckError ? 'var(--red)' : 'var(--border)'}`,
                borderRadius: 10,
                padding: '16px 20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: deckParsed ? 'var(--accent-dim)' : 'var(--surface-raised)',
                      border: `1px solid ${deckParsed ? 'var(--border-accent)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, flexShrink: 0,
                    }}>
                      {deckParsing ? '⏳' : deckParsed ? '✓' : '📄'}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>
                        {deckFile.name}
                      </div>
                      <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: deckParsed ? 'var(--accent)' : deckError ? 'var(--red)' : 'var(--text-muted)', letterSpacing: '0.04em' }}>
                        {deckParsing && 'Extracting content...'}
                        {deckParsed && `✓ Content extracted · ${Math.round(deckFile.size / 1024)}KB`}
                        {deckError && deckError}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18, padding: '4px 8px' }}>
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Fallback text paste */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                PDF not working? Paste your deck content instead:
              </div>
              <textarea
                style={{
                  ...inputStyle,
                  ...focusStyle('deck'),
                  minHeight: 120,
                  resize: 'vertical',
                  lineHeight: 1.6,
                  fontSize: 13,
                  opacity: deckParsed ? 0.5 : 1,
                }}
                placeholder="Problem, solution, market size, traction, team, business model..."
                value={form.deckText}
                onChange={e => { set('deckText', e.target.value); setDeckParsed(false); setDeckFile(null); }}
                onFocus={() => setFocused('deck')}
                onBlur={() => setFocused(null)}
                disabled={deckParsed}
              />
            </div>
          </div>

          {/* Product Link */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Product Link</label>
            <input
              style={{ ...inputStyle, ...focusStyle('link'), opacity: form.noProduct ? 0.4 : 1 }}
              placeholder="https://yourproduct.com"
              value={form.productLink}
              onChange={e => set('productLink', e.target.value)}
              onFocus={() => setFocused('link')}
              onBlur={() => setFocused(null)}
              disabled={form.noProduct}
            />
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                id="noProduct"
                checked={form.noProduct}
                onChange={e => { set('noProduct', e.target.checked); if (e.target.checked) set('productLink', ''); }}
                style={{ accentColor: 'var(--accent)', width: 14, height: 14 }}
              />
              <label htmlFor="noProduct" style={{ fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                We don't have a working product yet
              </label>
            </div>
            {form.noProduct && (
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--amber)', background: 'var(--amber-dim)', borderRadius: 6, padding: '8px 12px' }}>
                ⚠ No product will significantly impact your Product Existence score — this is the most common gap in MENA startup submissions.
              </div>
            )}
          </div>

          {/* Target Investor */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Target Investor Type *</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {INVESTORS.map(inv => (
                <button key={inv} type="button" onClick={() => set('targetInvestor', inv)}
                  style={{
                    padding: '8px 16px', borderRadius: 6, border: '1px solid',
                    borderColor: form.targetInvestor === inv ? 'var(--accent)' : 'var(--border)',
                    background: form.targetInvestor === inv ? 'var(--accent-dim)' : 'var(--surface)',
                    color: form.targetInvestor === inv ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: 13, fontFamily: 'var(--font-body)', cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                  {inv}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid}
            style={{
              width: '100%',
              background: isValid ? 'var(--accent)' : 'var(--surface)',
              color: isValid ? 'var(--bg)' : 'var(--text-muted)',
              border: 'none', borderRadius: 8, padding: '16px',
              fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)',
              cursor: isValid ? 'pointer' : 'not-allowed', transition: 'all 0.15s',
              letterSpacing: '-0.01em',
            }}>
            Get My PitchDepth Score →
          </button>

          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
            FREE EVALUATION · CALIBRATED FOR GCC INVESTORS
          </div>
        </form>
      </div>
    </div>
  );
}
