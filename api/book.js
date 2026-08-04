import { CAL, EVENT, configured, headers } from './_cal.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const b = req.body || {};
  if (!b.start || !b.name || !b.email) return res.status(400).json({ error: 'missing fields' });
  if (!configured() || !EVENT[b.type]) return res.status(501).json({ error: 'cal not configured' });

  const notes = [
    b.notes,
    b.watch ? `Watch: ${b.watch}` : '',
    b.people ? `Party: ${b.people}` : '',
    b.phone ? `Phone: ${b.phone}` : ''
  ].filter(Boolean).join('\n');

  try {
    const r = await fetch(`${CAL}/bookings`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        eventTypeId: Number(EVENT[b.type]) || EVENT[b.type],
        start: b.start,
        attendee: {
          name: b.name,
          email: b.email,
          phoneNumber: b.phone,
          timeZone: b.tz || 'Asia/Dubai',
          language: 'en'
        },
        bookingFieldsResponses: { notes }
      })
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(502).json({ error: 'cal ' + r.status, detail: j });
    // Cal sends the confirmation and reminder emails itself
    return res.status(200).json({
      ok: true,
      reference: (j.data && (j.data.uid || j.data.id)) || null
    });
  } catch (e) {
    return res.status(502).json({ error: 'upstream' });
  }
}
