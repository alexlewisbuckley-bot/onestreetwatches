# One Street Watches — UX Audit

Eleven pages, audited on the production build. No changes made.

Business goals below are **inferred**, because there is no analytics on the site
and I have not been told what converts. Every one of them is a hypothesis you
should confirm or correct before the redesign acts on it. Where a page's business
purpose is genuinely unclear I have said so rather than invented one.

---

## Defects found during the audit

These are broken, not badly designed. Listed first because they change what the
audit is measuring.

**Eight CTAs are styled as buttons but are not links.** They sit as `<span
class="go">` inside a `<div class="ccard">` — no anchor anywhere in the card.
Nothing happens when you tap them.

```
servicing   "Book this →"   × 4   (Full service, Polish, Authentication, Repairs)
contact     "Message us →", "Get directions →", "Request an appointment →", "Write to us →"
```

This is the bug you reported. My earlier fix rewrote every `<a href="#">` on the
site and reported success — but these were never anchors, so the fix passed
straight over them and I told you it was resolved when it was not.

**Three CTAs link to the page you are already on.** Tapping them reloads and
appears to do nothing.

```
sell        "Request a valuation →"      → sell.html
sourcing    "Start the search →"          → sourcing.html
sourcing    "Start a sourcing request →"  → sourcing.html
```

**The site makes seven unverified claims** across eleven pages: "41 checks",
"2,300+ watches sold", "38,000 following", "214 reviews", "4.9 / 5", "eleven days
average", "never been claimed in four years". None has been confirmed by you.
Three of them — the review count, the rating and the follower count — are
attributed to named third parties and are the kind of claim that draws
complaints if wrong.

**Most imagery does not exist.** 38 placeholder frames on the home page, 32 on a
product page, 89 across the shop grid. Every layout judgement below is being made
against art direction rather than photographs.

---

## Evidence

| Page | Words | H2 | H3 | CTAs | Distinct destinations | Placeholders | Mobile screens |
|---|---|---|---|---|---|---|---|
| Home | 1,758 | 8 | 14 | 17 | 9 | 38 | 7.2 |
| The case | 929 | 0 | 0 | 0 | — | 89 | 6.8 |
| Product | 477 | 1 | 0 | 5 | 4 | 32 | 3.5 |
| Booking | 223 | 4 | 5 | 3 | 2 | 0 | 4.0 |
| Sell | 647 | 5 | 6 | 3 | 3 | 0 | 7.4 |
| Sourcing | 598 | 5 | 6 | 3 | 2 | 0 | ~7 |
| Servicing | 522 | 5 | 6 | 7 | 3 | 0 | 6.9 |
| Visit | 417 | 3 | 5 | 7 | 6 | 3 | 6.1 |
| Journal | 299 | 1 | 6 | 2 | 2 | 6 | ~5 |
| About | 439 | 4 | 7 | 2 | 2 | 4 | ~6 |
| Contact | 231 | 2 | 5 | 7 | 4 | 0 | ~4 |

Seventeen CTAs pointing at nine destinations on the home page is the clearest
single number in the table. Three of them go to the same place.

---

# Page by page

## Home

**Why it exists.** To convert a cold visitor — most likely from Instagram or a
Google search for a reference — into someone who trusts an unfamiliar dealer
enough to browse stock or make contact.

**User's goal.** Two distinct arrivals, and the page currently serves neither
cleanly. The *browser* wants to see what is in stock and roughly what it costs.
The *sceptic* wants to know who these people are and why handing them AED 80,000
is safe. A third, smaller group arrives wanting to sell.

**Business goal (inferred).** Push traffic into the case. Everything else on the
page is in service of making that click feel safe.

**Primary action.** Should be *Browse the case*. It currently is, visually — but
it competes with sixteen other CTAs on the same page.

**Secondary actions.** Schedule a visit, sell a watch, read the authentication
process, follow on social.

**Information hierarchy.** Boutique photograph → headline → stock → maisons →
popular → authentication guarantee → reviews → film → services → concierge →
selling → social. Eleven blocks. The trust material (authentication, reviews)
sits *below* two carousels, so a sceptic must scroll past the sales pitch to
reach the reassurance that would let them take it seriously.

**Pain points.**
- Seventeen CTAs, nine destinations. No screen has one obvious next step.
- The shoppable boutique is the best idea on the site and is the least
  explained — nothing tells you the dots are worth pressing until you press one.
- The authentication section is six numbered steps of dense process copy. It is
  written for someone already convinced.
- The "film" section is a placeholder for a video that does not exist, presented
  with a play button as though it does.

**Redundant content.** Three CTAs to `shop.html`, two to `servicing.html`, two to
`sell.html`. The hero stat strip, the claims strip and the assurance strip make
overlapping promises within one screen. The concierge section restates Sourcing.
The selling section restates Sell. The social grid rebuilds Instagram inside a
page that already links to Instagram.

**Desktop assumptions.** The hotspots were hover-only until last week. The
featured card is positioned by absolute offsets against a fixed-height hero. The
brand and product rails assume a mouse for the arrow buttons.

**Mobile friction.** 7.2 screens after the phase-2 cuts, still the longest page.
The two carousels sit adjacent and read as one confusing rail. 54 of 85 tap
targets under 44px.

---

## The case (shop)

**Why it exists.** The catalogue. This is the product.

**User's goal.** Narrow 142 watches to the two or three worth opening — usually
by maison, budget, or a specific reference already in mind.

**Business goal.** Product-page views. Secondarily, to make a thin catalogue feel
deep.

**Primary action.** Open a watch.

**Secondary actions.** Filter, sort, search, switch currency.

**Information hierarchy.** Breadcrumb → title → 40-word paragraph → filters →
count → grid. **The 40-word paragraph is the problem.** On a phone it pushes the
first watch below the fold on a page whose entire purpose is showing watches.
Nobody arrives at a catalogue to read a mission statement.

**Pain points.**
- Zero H2s. The page is one undifferentiated grid with no sense of structure,
  no "new this week" or "under 50k" groupings to give a starting point.
- No empty-state guidance beyond one sentence.
- No saved or recently-viewed state. A returning visitor starts from nothing.
- Sort defaults to "Newest in", which does not sort — the catalogue has no
  date-added field, so the default sort is a no-op.

**Redundant content.** The lede duplicates the home page's value proposition
almost word for word. The breadcrumb "Home / The case / All watches" carries no
information at the top level.

**Desktop assumptions.** Dual-handle sliders are a mouse control. Card hover
scrubbing through four images is the primary way to see more than one angle, and
has no touch equivalent. The price histogram is decorative at phone width.

**Mobile friction.** 48 of 78 tap targets under 44px, mostly filter rows and card
internals. 24 watches is six screens; 142 will be thirty-five.

---

## Product

**Why it exists.** To close the decision, or to move it to a conversation.

**User's goal.** Confirm it is genuine, confirm the condition, understand what
"full set" means for this piece, and find out what happens next.

**Business goal.** An enquiry. There is no cart and no checkout, so every product
page is a lead-generation page dressed as e-commerce.

**Primary action.** *Reserve this watch* — which is an enquiry, not a purchase.

**Secondary actions.** WhatsApp, book a viewing, browse related.

**Information hierarchy.** Reasonable and recently improved. Gallery, brand,
model, price, fairness note, condition, actions, specs, five accordions, related.

**Pain points.**
- **The page implies commerce it cannot deliver.** It looked like a shop with an
  "Add to bag" button and no bag behind it. That is now "Reserve this watch", but
  the underlying tension remains: this is a lead form styled as a checkout.
- The "Fair — 4% under the 90-day market average" claim has no source shown. It
  is the most persuasive line on the page and the least substantiated.
- Five accordions is more disclosure than one watch needs.
- 32 placeholder frames. A watch page with no photographs of the watch cannot be
  properly evaluated.

**Redundant content.** *Reserve this watch* appears twice with the same
destination, once inline and once in the sticky bar — defensible on desktop,
duplicated on mobile.

**Desktop assumptions.** Click-to-zoom. Thumbnail strip. Sticky buy bar triggered
by an IntersectionObserver tuned to desktop scroll distances.

**Mobile friction.** Lowest of any page at 3.5 screens. 40 of 53 targets under
44px.

---

## Booking

**Why it exists.** To turn interest into a diarised appointment.

**User's goal.** Pick a time without a phone call.

**Business goal.** The highest-value conversion on the site. A booked viewing is
worth vastly more than a page view.

**Primary action.** Confirm the booking.

**Secondary actions.** Change viewing type, add to calendar, WhatsApp.

**Information hierarchy.** Good — it is the only page built as a flow rather than
a document. Step rail, one decision per step, live summary alongside.

**Pain points.**
- **It cannot currently keep its promise.** Without the Cal.com key the slots are
  generated from hard-coded opening hours, so a time shown as free may not be.
  The copy is honest about this, but the calendar still looks authoritative.
- The month grid gives 48px cells at best. 41 of 51 targets under 44px — the
  worst ratio on the site.
- No indication of what happens after booking, beyond one line.
- The opening hours in the code are my invention and have never been confirmed.

**Redundant content.** Little. This page is the tightest on the site at 223 words.

**Desktop assumptions.** A full month grid, a sidebar summary, and a five-field
form presented at once.

**Mobile friction.** Four screens for what should be three taps.

---

## Sell

**Why it exists.** Stock acquisition — arguably the harder half of the business.

**User's goal.** Find out what their watch is worth, without commitment and
without being harvested.

**Business goal.** Buy inventory below market.

**Primary action.** Get a valuation.

**Secondary actions.** WhatsApp photos, book an in-person valuation.

**Information hierarchy.** Hero → process → form → FAQ → CTA band. Sensible.

**Pain points.**
- **The primary CTA links to the page it is on.** "Request a valuation →" reloads
  `sell.html`. The most important button on the acquisition side of the business
  does nothing.
- 15 form fields is a lot to ask before any number is offered. The page promises
  "a firm offer within the hour" but front-loads the effort.
- No indication of what the watch is worth before the form — no range, no
  comparable, nothing.

**Redundant content.** The closing CTA band repeats the hero CTA. "2,300+
watches sold" appears here and on About.

**Desktop assumptions.** Two-column split layout; a long single-page form.

**Mobile friction.** 7.4 screens — the longest page on the site after Home, for
what is fundamentally "send us four photos".

---

## Sourcing

**Why it exists.** To monetise the dealer network, and to capture demand for
stock not held.

**User's goal.** Say what they want and find out if it is realistic.

**Business goal.** High-margin brokerage with no inventory risk.

**Primary action.** Start a sourcing request.

**Secondary actions.** WhatsApp the concierge, read the FAQ.

**Information hierarchy.** Hero → how it works → recent examples → FAQ → CTA.

**Pain points.**
- **Both primary CTAs are circular** — "Start the search" and "Start a sourcing
  request" both link to `sourcing.html`. The page has no working conversion path
  at all; only the WhatsApp link functions.
- "Average: eleven days" is stated three times across the site and is unverified.
- The recent-examples cards are the most persuasive content and sit third.

**Redundant content.** Substantially duplicated by the concierge section on the
home page.

**Desktop assumptions.** Two-column split; four-across example cards.

---

## Servicing

**Why it exists.** Aftercare revenue, and proof that the bench is real — which is
what underwrites the authentication claim everywhere else.

**User's goal.** Find out if they will look at their watch, what it costs, and
how long it takes.

**Business goal.** Service revenue, plus a soft route into part-exchange.

**Primary action.** Book a service.

**Secondary actions.** Ask first on WhatsApp, read the process.

**Information hierarchy.** Hero → four service cards with prices → process →
FAQ → CTA band.

**Pain points.**
- **All four service cards are unclickable.** Price is shown, "Book this →" is
  shown, nothing happens. This is the highest-intent moment on the page — the
  user has read the price and decided — and it is a dead end.
- Prices are given "from", with no way to get a real quote without leaving.
- "41 checks" appears here, on Home, on Journal and on About, unverified.

**Redundant content.** The closing CTA duplicates the header CTA. The process
list overlaps the home page's authentication steps.

---

## Visit

**Why it exists.** Get people into a room with the stock.

**User's goal.** Find out where it is, when it is open, and whether they need an
appointment.

**Business goal.** In-person visits close at far higher rates than online.

**Primary action.** Book a viewing.

**Secondary actions.** Directions, call, WhatsApp.

**Information hierarchy.** Hero → two location cards → facts → what a viewing is
like → gallery → CTA. The address — the single most important fact — is inside
the second block rather than the first.

**Pain points.**
- **The UK has no address.** It says "United Kingdom, by appointment" and nothing
  else. A visitor cannot tell if that means London, Manchester or a hotel suite.
- Both phone numbers are placeholders.
- Maps are placeholder frames, so "Get directions" is the only route to a real
  location and on the Contact page that button is not even a link.
- Opening hours appear in three places and must be maintained in three places.

**Redundant content.** Overlaps Contact almost entirely — same phone, same
WhatsApp, same address, same intent.

---

## Contact

**Why it exists.** Unclear. It duplicates Visit.

**User's goal.** Reach a human.

**Business goal.** Not obvious beyond capturing enquiries that do not fit
elsewhere.

**Primary action.** Send a message.

**Secondary actions.** WhatsApp, call, visit.

**Pain points.**
- **All four channel cards are unclickable** — WhatsApp, directions, appointment,
  email are presented as buttons and are inert spans.
- The contact form's Send button has no destination and no handler. It is a form
  that cannot be submitted.
- Every channel it offers is offered on Visit, which also has the address.

**Recommendation for the redesign phase.** This page is a candidate for deletion,
merged into Visit. Note that this is a decision to make later; it is recorded
here as a finding, not an action.

---

## Journal

**Why it exists.** SEO and credibility.

**User's goal.** Passive — nobody arrives at a dealer intending to read a blog.

**Business goal.** Organic search traffic on reference-number queries, and
demonstrating expertise.

**Primary action.** Read an article.

**Pain points.**
- **None of the six articles exist.** Every card links nowhere and every image is
  a placeholder. The page advertises content that has not been written.
- It ranks for nothing while empty, so it currently delivers neither of its two
  purposes.

**Recommendation.** Either commission the articles or remove the page until they
exist. An empty journal reads worse than no journal.

---

## About

**Why it exists.** To answer "who are these people" for the sceptic.

**User's goal.** Decide whether the business is real and durable.

**Business goal.** Reduce the trust barrier on a high-value purchase.

**Primary action.** Book a viewing.

**Information hierarchy.** Founding story → facts → the boutique → team → CTA.

**Pain points.**
- **The team section has no names and no faces** — placeholder portraits captioned
  "Name to confirm". On the page whose entire job is establishing that real
  people stand behind the business, the people are missing. This is the single
  most damaging placeholder on the site.
- Three unverified claims in one strip: 2,300+ sold, 4.9 rating, 41 checks.
- No trade credentials, registration number, or professional memberships — the
  things a cautious buyer actually looks for.

---

# Cross-cutting findings

**One. There is no measurement.** No analytics, no event tracking, no way to know
which of the seventeen home-page CTAs anyone uses. Every priority in the redesign
will be an argument rather than a finding until this exists. I would fix this
before the redesign, not after, so the redesign can be judged.

**Two. The site is a lead-generation business wearing e-commerce clothing.**
There is no cart, no checkout, no payment. Every path ends in a conversation —
WhatsApp, a booking, a form. The interface should stop implying otherwise;
"Reserve this watch" was a step, but the shop-shaped scaffolding around it still
sets a checkout expectation the business does not fulfil.

**Three. Trust content is positioned as decoration rather than argument.** The
authentication guarantee, the reviews, the bench, the team — these are the
reasons someone buys a AED 780,000 watch from a four-year-old dealer. They are
currently distributed as sections between carousels rather than sequenced as a
case.

**Four. Every page ends with a CTA band that repeats the CTA at the top.** Seven
pages, seven duplicated closing actions.

**Five. Placeholder density is the limiting factor.** 89 placeholder frames in
the shop, 38 on the home page, 32 per product page, no team photographs, no maps,
no journal articles, no film. The redesign can improve structure, but the site
cannot be evaluated as a premium product until the photography exists — and a
premium watch site is, more than anything else, photographs.

---

# What I need from you before the redesign

1. **Confirm or correct the business goals above**, particularly the relative
   value of a booking versus an enquiry versus a sale.
2. **Confirm the seven unverified claims**, or tell me to remove them.
3. **UK address and both phone numbers.**
4. **Team names**, or a decision to cut the team section.
5. **Whether Contact should merge into Visit.**
6. **Whether the Journal stays** — and if so, when the articles arrive.
7. **Whether to add analytics** before the redesign, so the next round is
   measured rather than argued.
