import { CAL, EVENT, configured, headers } from './_cal.js';

export default async function handler(req, res) {
  const { type = 'dubai', date, tz = 'Asia/Dubai' } = req.query || {};
  if (!date) return res.status(400).json({ error: 'date required' });
  if (!configured() || !EVENT[type]) return res.status(501).json({ error: 'cal not configured' });

  const q = new URLSearchParams({
    eventTypeId: String(EVENT[type]),
    start: date,
    end: date,
    timeZone: tz
  });

  try {
    const r = await fetch(`${CAL}/slots?${q}`, { headers: headers() });
    if (!r.ok) return res.status(502).json({ error: 'cal ' + r.status });
    const j = await r.json();
    // Cal returns { data: { "2026-08-12": [{ start }, … ] } }
    const day = (j.data && (j.data[date] || Object.values(j.data)[0])) || [];
    const slots = day.map(s => s.start || s).filter(Boolean);
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
    return res.status(200).json({ slots });
  } catch (e) {
    return res.status(502).json({ error: 'upstream' });
  }
}
