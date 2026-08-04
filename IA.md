# One Street Watches — Information Architecture

Measured, not assumed. Two things I checked before proposing anything: the real
link graph of the site body (excluding nav and footer, which link to everything
and therefore prove nothing), and how many taps each real journey actually takes.

---

## What the evidence says

### Three pages are orphans

In-degree, counting only links inside page content:

```
index      10        sell         1
book        6        servicing    1
shop        3        visit        1
product     2        contact      1
                     sourcing     0   ←
                     journal      0   ←
                     about        0   ←
```

**Sourcing has zero inbound links.** It is a high-margin, no-inventory-risk
revenue line, and no page on the site sends anyone to it. It exists only in the
nav. The same is true of About — the page that answers "should I trust these
people" — and Journal.

### The journeys are already short

```
Book a viewing                        3 taps
Find the Dubai address                2 taps
Get a service price                   2 taps
Find a Rolex under 50k and enquire    5 taps
```

This matters because it kills the obvious hypothesis. The IA problem is **not
depth**. The dock fixed depth. The problem is that eleven destinations exist for
what is really four jobs, and the same content is written four times across them.

### The same content is written repeatedly

Headings appearing on more than one page:

```
"Common questions"    sell, sourcing, servicing, contact     ← four separate FAQs
"Authentication"      index, servicing
"The bench"           servicing, about
"United Kingdom"      visit, contact
"Name to confirm"     about × 4                              ← the team, unnamed
```

Sourcing and Servicing have **identical structures** — 5 H2s and 6 H3s each, hero,
process list, examples, FAQ, closing CTA. They are the same page with different
nouns.

*(The 57% text overlap between shop and product is product-card data, not prose.
I am not counting it as duplication.)*

---

## The structural problem

The site is organised as **eleven documents**. The business has **four jobs**:

| Job | Currently spread across |
|---|---|
| Buy a watch | home, case, product |
| See it in person | book, visit, contact |
| Sell or part-exchange | sell, home selling section |
| Have a watch found or serviced | sourcing, servicing, home concierge section |

And a fifth thing that is not a job and should never have been a page: **trust**.
Authentication, the bench, the guarantee, the reviews, the team. Those currently
sit as sections in Home and About — the two places a hesitant buyer is least
likely to be at the moment they hesitate. Trust content belongs *at the point of
doubt*, not in a room of its own.

---

## Proposed architecture

Eleven URLs become seven. The dock already implies this structure, which is a
good sign — it was designed around the same four jobs.

```
/                    Home
/case                The case          → /case/:ref
/book                Book               (viewing · video · UK · service drop-off)
/sell                Sell or trade
/services            Services           (source a watch | service a watch)
/visit               Visit & contact
/about               About
```

### Merge: Contact → Visit

Same intent — reach us. Same four channels — WhatsApp, phone, email, in person.
Visit already has the address; Contact has the same phone number and a form whose
Send button has no destination. Two pages exist because desktop conventions say a
site has a Contact page. Nobody on a phone thinks "I need the Contact page"; they
think "how do I get hold of them" or "where is it".

### Merge: Sourcing + Servicing → Services

Two pages with the same skeleton, the same FAQ pattern, the same closing CTA, both
terminating in the same booking flow. One page, one segmented control at the top:
**Source a watch | Service a watch**. The decision happens in one tap instead of
requiring the user to have picked the right nav item before they understand the
difference — which is the harder ask, because "sourcing" and "servicing" are one
letter apart and mean nothing to a first-time visitor.

This also fixes the orphan: Services earns inbound links from the product page
("can't find this reference?") and from Sell ("we can service it before we value
it") in a way Sourcing never did.

### Distribute: About → the moments of doubt

About has no inbound links and answers a question nobody asks in the abstract.
Break it up:

- **The team and the bench** move into `/book` and `/visit` — you meet people when
  you are deciding to walk into a room or hand over a watch.
- **The guarantee and the 41 checks** move onto the product page, behind
  disclosure, where the doubt actually occurs.
- **The founding story** stays at `/about`, which becomes a short page for the
  small number of people who go looking.

### Delete: Journal — or commit to it

Zero inbound links, zero articles, six placeholder cards advertising content that
does not exist. It currently delivers neither of its two purposes (search traffic
and credibility) and actively costs credibility to anyone who taps a card. Either
commission the articles or remove the page until they exist.

### Dissolve: four FAQs → contextual disclosure

"Common questions" appears at the bottom of four pages, in each case after the
CTA. An FAQ at the bottom of a page is an admission that the page did not answer
the question at the moment it arose. Each answer moves next to the decision it
unblocks:

- "Do I pay anything up front?" → beside the sourcing CTA, not 800px below it.
- "How quickly do you deliver?" → on the product page, next to the price.
- "Do I need an appointment?" → in the booking flow, at the step where it matters.

---

## Decisions that should happen earlier

**Location.** Whether a client is in the UAE or the UK changes the stock they can
see, the price they pay, the delivery promise and whether a viewing is even
possible. Today it is a filter buried in the case, and the site says "Dubai and
the UK" in a dozen places without ever asking. Ask once on first visit, infer from
locale as the default, persist it, and let it colour everything: *"10 pieces in
the UK — viewable Thursday"* rather than *"142 in stock"*.

**Currency** follows from location and should stop being a control in a menu.

**Viewing type.** Arriving at `/book` from a watch already answers "what kind of
viewing". That inference is now made — the flow skips to the calendar — and the
same should apply from Services (a service drop-off) and from Visit (location
implies the branch).

---

## Steps that can be removed

**Sell asks for 15 fields before offering a number.** The page promises "a firm
offer within the hour" and then front-loads all the effort onto someone who has
not yet been given a reason to trust the outcome. Invert it: brand, model and
three photographs — four inputs — produce an indicative range immediately, and the
remaining detail is collected only from people who accept it.

**Seven closing CTA bands** repeat the CTA at the top of the same page. On mobile
the primary action is in a sticky bar and the dock. Delete all seven.

**Three home-page sections duplicate whole pages** — concierge duplicates
Sourcing, the selling block duplicates Sell, the six authentication steps
duplicate Servicing. They are already cut on mobile. They should be cut on desktop
too, replaced by a single line and a link, because maintaining the same copy in
two places guarantees they will disagree within a month.

---

## Redirects required

If this is adopted, these must be server-side 301s in `vercel.json` — the pages
are indexed and linked from the sitemap.

```
/contact    → /visit
/sourcing   → /services?intent=source
/servicing  → /services?intent=service
/journal    → /            (only if Journal is deleted)
```

---

## What this changes, in numbers

```
URLs                        11  →  7
Separate FAQ blocks          4  →  0   (answers move inline)
Closing CTA bands            7  →  0
Orphan pages                 3  →  0
Duplicated home sections     3  →  0
Journeys with zero inbound   1  →  0   (Sourcing)
```

---

## What I need decided before building this

Four of these have been open since the audit. The IA cannot be built without
them, because each one changes the map.

1. **Does Journal stay?** If yes, when do the six articles arrive? If no, I delete
   the page and redirect.
2. **Contact merged into Visit** — confirm.
3. **Sourcing and Servicing merged into Services** — confirm. This is the biggest
   single change and the one I am most confident about.
4. **About broken up** — confirm, and give me team names, or confirm the team
   section is cut.
5. **Location asked on first visit** — yes or no. It is the highest-leverage
   change in this document and also the most intrusive, so it is your call.
6. **Sell inverted to give a number before the form** — this needs a real pricing
   rule from you, even a crude one, or it cannot be honest.

I have built nothing from this document. Say which of the six you want and I will
sequence the work.
