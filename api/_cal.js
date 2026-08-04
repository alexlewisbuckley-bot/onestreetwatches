/* Shared Cal.com config. The API key never reaches the browser — these
   functions run on Vercel and proxy the calls.

   Environment variables to set in Vercel → Settings → Environment Variables:
     CAL_API_KEY        your Cal.com API key (cal_live_…)
     CAL_EVENT_DUBAI    event type id or slug for a Dubai salon viewing
     CAL_EVENT_UK       event type id or slug for a UK appointment
     CAL_EVENT_VIDEO    event type id or slug for a video viewing
     CAL_USERNAME       your cal.com username
   Until CAL_API_KEY is present both endpoints return 501 and the front end
   falls back to opening-hours slots plus a WhatsApp handoff. */

export const CAL='https://api.cal.com/v2';

export const EVENT = {
  dubai:    process.env.CAL_EVENT_DUBAI,
  uk:       process.env.CAL_EVENT_UK,
  video:    process.env.CAL_EVENT_VIDEO,
  specific: process.env.CAL_EVENT_DUBAI      // a named piece is still a salon viewing
};

export const configured = () => Boolean(process.env.CAL_API_KEY);

export const headers = () => ({
  'Authorization': `Bearer ${process.env.CAL_API_KEY}`,
  'cal-api-version': '2024-09-04',
  'Content-Type': 'application/json'
});
