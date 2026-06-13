import { PITCHDEPTH_SYSTEM_PROMPT } from './rubric';

export async function evaluateStartup(formData) {
  const { companyName, description, stage, productLink, targetInvestor, deckText, deckPDF } = formData;

  const textContent = [
    'Please evaluate this MENA startup submission:',
    'COMPANY NAME: ' + companyName,
    'ONE-LINE DESCRIPTION: ' + description,
    'FUNDING STAGE: ' + stage,
    'PRODUCT LINK: ' + (productLink || 'NOT PROVIDED'),
    'TARGET INVESTOR TYPE: ' + targetInvestor,
    deckPDF ? 'PITCH DECK: See attached PDF.' : 'PITCH DECK CONTENT:\n' + (deckText || 'No deck content provided'),
    'Apply the PitchDepth rubric strictly.',
    'No product link = max 5 for Product Existence. No MENA market mention = max 10 for Market & Traction.'
  ].join('\n\n');

  const messageContent = deckPDF
    ? [{ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: deckPDF.base64 } }, { type: 'text', text: textContent }]
    : textContent;

  const response = await fetch('/api/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, system: PITCHDEPTH_SYSTEM_PROMPT, messages: [{ role: 'user', content: messageContent }] }),
  });

  if (!response.ok) throw new Error('API error: ' + response.status);
  const data = await response.json();
  const text = data.content?.map(b => b.text || '').join('').trim();
  const clean = text.replace(/```json|```/g, '').trim();
  try { return JSON.parse(clean); } catch { throw new Error('Failed to parse evaluation response'); }
}
