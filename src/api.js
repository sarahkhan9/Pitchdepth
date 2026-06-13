import { PITCHDEPTH_SYSTEM_PROMPT } from './rubric';

export async function evaluateStartup(formData) {
  const { companyName, description, stage, productLink, targetInvestor, deckText, email } = formData;

  const userMessage = `
Please evaluate this MENA startup submission:

COMPANY NAME: ${companyName}

ONE-LINE DESCRIPTION: ${description}

FUNDING STAGE: ${stage}

PRODUCT LINK: ${productLink || 'NOT PROVIDED'}

TARGET INVESTOR TYPE: ${targetInvestor}

PITCH DECK CONTENT:
${deckText || 'No deck content provided'}

Apply the PitchDepth rubric strictly. Score what exists, not what is claimed.
Remember: No product link = max 5 for Product Existence. No MENA market mention = max 10 for Market & Traction.
  `.trim();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: PITCHDEPTH_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.map(b => b.text || '').join('').trim();

  // Strip any markdown fences if present
  const clean = text.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(clean);
  } catch {
    throw new Error('Failed to parse evaluation response');
  }
}
