# One Street Watches — Mobile-First Redesign

**Audited on the production build at 390 × 844, iPhone emulation, 2× DPR.**

---

## The finding that reframes everything

The site does not have a poor mobile layout. It has **no mobile layout at all.**

```
Device width ........................ 390 px
Actual layout viewport .............. 896 px
Nav content width ................... 896 px  (logo 156 + links 392 + search 268 + bag + padding)
Widest block on the page ........... 2690 px
```

The navigation bar cannot compress below 896px, so the browser widens the layout
viewport to fit it. Safari then shrinks the whole page to fit the screen. Two
consequences follow, and they explain every other symptom:

1. **Everything renders at roughly 43% scale**, or the page pans sideways. The
   truncated words in the header are not a wrapping bug — they are the left
   edge of an 896px page shown through a 390px window.
2. **Every media query below 896px never fires.** `max-width: 900`,
   `max-width: 700`, `max-width: 640`, `max-width: 520` — all dead code on a
   phone. The responsive CSS that exists has never once executed on a real device.

Fixing this is not step one of the redesign. It is the precondition for any of it
being visible.

### What else the audit measured

| Page | Screens tall | Tap targets under 44px | Text under 13px |
|---|---|---|---|
| Home | 6.4 | 71 of 114 | 152 |
| Shop | 6.9 | 60 of 86 | 183 |
| Product | 2.1 | 55 of 73 | 91 |
| Booking | 1.6 | 48 of 54 | 50 |
| Sell | 3.4 | 57 of 71 | 54 |

**62% of every interactive element on the site is below the 44px minimum.** The
home page is 12,396px long — thirty-two thumb-swipes from top to bottom.

And the centrepiece of the home page, the shoppable boutique, is driven entirely
by `mouseenter`. On a phone it is an inert photograph with a caption that reads
*"Hover a case to see what's inside."*

---

## Navigation — designed from scratch

The desktop model is a horizontal bar plus two mega-menus opened on hover. Hover
does not exist, the bar does not fit, and the mega-menus are four-column grids.
None of it survives contact with a phone. It is not adapted; it is replaced.

**A persistent bottom dock**, five destinations, thumb-height, edge-to-edge:

```
   Case        Search       Book        Sell        More
   grid        magnifier    calendar    tag         •••
```

The reasoning behind each slot:

- **Case** is the product. It is the reason anyone opens the site.
- **Search** earns a permanent slot because watch buyers arrive with a reference
  number in mind. On desktop it is a field in the corner; on mobile it becomes a
  full-screen instant-results view, which is faster than any category browse.
- **Book** is the conversion action and now has a real flow behind it. Making it
  reachable from every screen without scrolling is the highest-leverage change on
  the site.
- **Sell** is the supply side of the business. It was buried in the nav; it is
  worth a permanent slot because acquiring stock matters as much as selling it.
- **More** opens a sheet with Sourcing, Servicing, Visit, Journal, About,
  Contact, currency and WhatsApp. These are considered-visit pages, not
  browse-loop pages, and they do not deserve permanent chrome.

The top of the screen keeps only what must be there: the logo, and a contextual
right-hand action that changes per page (share on a product, filter count on the
case, currency elsewhere). The utility bar with two locations, Trustpilot and a
WhatsApp button is **deleted on mobile** — four competing messages before the
user has seen a single watch. Trustpilot moves to the reviews section where it is
evidence rather than decoration; WhatsApp becomes a floating action on the pages
where messaging is the natural next step.

**Gestures.** Horizontal swipe moves through product images and between adjacent
watches on a product page. Vertical drag dismisses any bottom sheet. Pull-to-
refresh is deliberately *not* implemented — it conflicts with Safari's own
gesture and the catalogue is not live-updating.

---

## Page by page

### Home

**Current.** 12,396px — hero, brand carousel, popular carousel, authentication
band with six numbered steps, reviews, film, four services, concierge, selling,
social grid, footer. Eleven sections, four of which carry a heading, a paragraph
and a "view all" link that all say roughly the same thing.

**Issues.** The hero alone is 1.5 screens before any watch is visible. The
shoppable boutique is hover-only and therefore dead. Three separate carousels
compete. Six authentication steps is a wall of text nobody reads on a phone. The
stat strip, the claims strip and the assurance strip repeat each other.

**Proposed.**

1. **Compact hero, one screen.** Boutique photo at 56vh with the headline over
   it, one primary button — *Browse the case* — and a single line of proof. The
   sub-paragraph and the three-stat strip are cut; they are desktop luxuries.
2. **Shoppable boutique becomes tap-first.** The hotspots become numbered dots.
   Tapping one opens a bottom sheet with the watches in that case. This turns the
   single best idea on the site from broken into the most engaging thing on the
   phone.
3. **Merge the two carousels.** "Shop by maison" and "Popular right now" become
   one horizontally-snapping rail under a segmented control: `Popular | New in |
   By maison`. Three sections collapse into one screen-height component.
4. **Authentication: six steps → one claim plus a sheet.** The guarantee line
   stays visible. The six-step process moves behind *How we check a watch*,
   opening a sheet. Progressive disclosure: the promise is the message, the
   method is the evidence, and only the promise needs to be on the page.
5. **Reviews become a swipe rail**, score block reduced to one line.
6. **Services grid → horizontal cards.** Four full-width cards is a screen and a
   half; four snapping cards is a thumb-flick.
7. **Cut on mobile:** the film section (a placeholder for a video that does not
   exist), the concierge section (duplicates Sourcing, which is one tap away in
   More), the social grid (send people to Instagram from the footer rather than
   rebuilding Instagram inside the page), and the sell section (Sell has a
   permanent dock slot).

Eleven sections → six. Roughly 12,400px → roughly 4,200px.

### The case (shop)

**Current.** 6.9 screens. The ten filter buttons wrap onto three rows and consume
an entire screen band before a single watch appears. One card per row.

**Issues.** Filters occupy 25% of the first screen and are the least likely thing
to be used first. Single-column cards mean 24 watches is fourteen screens. The
sort control sits above the fold competing with filters.

**Proposed.**

- **Two columns.** At 390px that is a 187px card — enough for the image, model
  and price. Reference, year, box, papers and condition move to the card's
  expanded state on the product page. Twenty-four watches becomes six screens
  instead of fourteen.
- **Filters become a bottom sheet** behind a single sticky pill: *Filter · 3*.
  The sheet is a scrollable list of collapsed groups, opens over the results, and
  applies live with a running count on the apply button — *Show 8 watches*. The
  user never loses their place in the grid.
- **Sort joins the same sheet**, or a compact segmented control if used often.
- **A sticky horizontal chip rail** of the four most-used filters — Rolex, Under
  50k, Full set, Unworn — sits under the header for one-tap entry into the most
  common intents without opening anything.
- **Progressive loading:** 12 cards, then more on scroll, with skeleton cards
  rather than a jump.

### Product

**Current.** 2.1 screens with the desktop two-column layout collapsed.

**Issues.** The gallery is a square with thumbnails below — thumbnails are a
desktop affordance. Five accordions plus a two-column spec table plus a buy bar
plus a related rail is more page than a phone needs. The buy bar and the inline
buttons say the same thing twice.

**Proposed.**

- **Edge-to-edge swipeable gallery** with dot indicators, pinch to zoom. No
  thumbnails.
- **Above the fold:** brand, model, price, condition, one line of assurance.
  Nothing else.
- **Persistent bottom bar** with price and *Enquire* — the single primary action.
  *Book a viewing* sits beside it as the secondary.
- **Specs collapse to the six that matter** (reference, year, size, dial, box,
  papers) as a two-column card; the rest go behind *Full specification*.
- **Accordions stay** — they are already the right mobile pattern — but reduce
  from five to three.
- **Swipe left/right at the page edges** moves to the next watch, so browsing
  does not require going back to the grid.

### Booking

**Current.** 1.6 screens, and the best-structured page on the site — it was built
as a flow. But 48 of its 54 tap targets are under 44px, and the calendar cells
are the worst offenders.

**Proposed.** Keep the architecture; rebuild the controls.

- Viewing type: four full-width cards, one tap, auto-advance.
- **The calendar becomes a horizontal date rail** — seven days visible, swipe for
  more, tap to expand to a full month sheet if needed. A month grid on a 390px
  screen gives 48px cells at best; a date rail gives 64px targets and matches how
  people actually book, which is "the next few days".
- Times as a two-column grid of 56px pills.
- The form splits: contact details, then notes, as two short steps rather than
  one five-field wall.
- Sticky *Continue* at the bottom, disabled until the step is valid.
- The summary rail becomes a collapsed one-line header that expands on tap.

### Sell, Sourcing, Servicing, Visit, About, Journal, Contact

**Current.** Each 2.2–3.4 screens of alternating prose blocks, numbered lists,
fact strips and a closing CTA band.

**Proposed.** These are one template, not seven pages of bespoke layout.

- Compact hero: title, one sentence, one action.
- Body as accordions — the numbered process lists are already sequential and
  benefit from being collapsed.
- The four-cell fact strip becomes a two-column card grid; on a phone a four-wide
  strip is unreadable at any size.
- **Delete the closing CTA band on mobile.** The primary action is in the sticky
  bar and the dock. A third copy of it at the bottom of the page is noise.
- **Contact merges into Visit.** They are the same intent — reach us — split
  across two pages for desktop's benefit.

Seven pages → six, each roughly 1.5 screens instead of three.

---

## Consolidated decisions

**Remove on mobile:** the utility bar, the desktop nav and both mega-menus, the
film section, the concierge section, the social grid, the home selling section,
all closing CTA bands, gallery thumbnails, the hero stat strip, the hero
sub-paragraph, the claims strip.

**Merge:** brand carousel + popular carousel + new in → one segmented rail;
Contact → Visit; sort → filter sheet; the seven content pages → one template.

**Redesign:** navigation → bottom dock; filters → bottom sheet; hero → compact,
one action; boutique hotspots → tap sheets; product gallery → swipe; calendar →
date rail; forms → multi-step; authentication steps → sheet; spec table → card
plus disclosure; product grid → two columns.

---

## Accessibility

Every interactive element to a 44 × 44px minimum — the audit's 62% failure rate
is the largest single accessibility defect on the site. Body text no smaller than
14px, and the current 8.5–11px metadata raised to 12px minimum. Dock items get
visible labels, not icons alone. Sheets are focus-trapped, `aria-modal`,
dismissible by Escape and by drag, and return focus to the trigger on close.
Swipe interactions all keep a tap equivalent — no function reachable only by
gesture. `prefers-reduced-motion` collapses sheet springs and card transitions to
opacity-only. Contrast: the `--pale` token at #8A847B on #F7F4EF is 3.1:1, which
fails AA for body text and needs darkening to roughly #6E6860 wherever it carries
content rather than decoration.

## Performance

The five boutique renders total 800KB and all five load for the hero crossfade —
on mobile, load one and lazy-load the rest behind the tap. `loading="lazy"` and
explicit `width`/`height` on every product image to stop layout shift. Skeleton
cards during progressive load rather than a growing blank. Sheets animate
`transform` only, never `height`. The `drop-shadow` filters on product images are
the most expensive paint on the grid and should become a static shadow layer on
mobile. Target: first watch visible under 1.5s on 4G, versus a current hero that
blocks on 160KB before anything renders.

## Breakpoints

Not one layout scaled four ways.

- **320–389** — small phones. One-column grid, dock labels hidden, hero 48vh.
- **390–429** — the design target. Two-column grid, full dock, hero 56vh.
- **430–767** — large phones and foldables. Two columns with more generous cards.
- **768–1023** — tablets. Three columns; filters return to a slide-over panel
  rather than a sheet; dock becomes a left rail in landscape.
- **1024+** — desktop as it is today, which is well-resolved and should not be
  disturbed.

The mobile work is additive and gated. Desktop keeps its current layout intact.
