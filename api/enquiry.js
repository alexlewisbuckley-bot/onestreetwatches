/* Sell / Sourcing enquiries — forwards the composed enquiry (with photos)
   to the shop's inbox via Resend. Configure in Vercel env:
     RESEND_API_KEY  — from resend.com
     ENQUIRY_TO      — where enquiries land, e.g. hello@onestreetwatches.com
     ENQUIRY_FROM    — optional verified sender; defaults to Resend's onboarding sender
   Until configured this returns 503 and the site falls back to WhatsApp. */

export const config = { api: { bodyParser: { sizeLimit: '4mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'POST only' });
  const b = req.body || {};
  if (!b.brand || !b.model || !b.contact)
    return res.status(400).json({ ok: false, error: 'missing fields' });

  const key = process.env.RESEND_API_KEY, to = process.env.ENQUIRY_TO;
  if (!key || !to) return res.status(503).json({ ok: false, error: 'not configured' });

  const kind = b.page === 'sourcing' ? 'Sourcing request' : 'Valuation request';
  const lines = [
    `${b.brand} ${b.model}`,
    b.cond   ? `Condition: ${b.cond}` : '',
    b.kit    ? `Includes: ${b.kit}` : '',
    b.budget ? `Budget: ${b.budget}` : '',
    `Reply to: ${b.contact}`,
    `Photos: ${(b.photos || []).length}`
  ].filter(Boolean).join('\n');

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM || 'One Street Watches <onboarding@resend.dev>',
        to: [to],
        subject: `${kind} — ${b.brand} ${b.model}`,
        text: lines,
        attachments: (b.photos || []).slice(0, 6).map((p, i) => ({
          filename: p.name || `photo-${i + 1}.jpg`,
          content: String(p.data || '').split(',')[1] || ''
        }))
      })
    });
    if (!r.ok) return res.status(502).json({ ok: false, error: 'mail relay refused' });
    return res.json({ ok: true });
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'mail relay unreachable' });
  }
}
