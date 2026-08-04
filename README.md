# One Street Watches

Marketing and commerce site for One Street Watches — a pre-owned and vintage watch dealer
operating in Dubai and the United Kingdom.

Static site. No framework, no build step required to deploy — the files at the repository
root are the site.

## Pages

| Page | File | Notes |
|---|---|---|
| Home | `index.html` | Shoppable boutique hero, maison carousel, popular watches, authentication, film, services, concierge, selling, social |
| The case | `shop.html` | Full catalogue with live filtering by maison, price, dial, case size, box & papers, condition and location |
| Product | `product.html` | Data-driven — `product.html?i=8` renders the ninth watch. Gallery, spec table, accordions, sticky buy bar |
| Sell & trade | `sell.html` | Valuation form and process |
| Sourcing | `sourcing.html` | Concierge search request |
| Servicing | `servicing.html` | Servicing, polishing, authentication, repairs |
| Visit us | `visit.html` | Both locations, booking form, gallery |
| Journal | `journal.html` | Editorial index |
| About | `about.html` | Story, numbers, team |
| Contact | `contact.html` | Contact routes, form, FAQ |

## Structure

```
/                 built site — this is what Vercel serves
  assets/css      core.css (tokens, header, footer, components) + per-page stylesheets
  assets/js       core.js (catalogue, currency, mega menus, carousels) + per-page scripts
  assets/fonts    Inter Tight, latin subset, weights 200–500
  assets/img      boutique renders, product cut-outs, logo
/source           unbuilt fragments — edit these
build.py          assembles /source into the site at the repository root
```

### Editing

Change a fragment in `/source`, then:

```bash
python3 build.py
```

Header, footer and the two mega menus live in `source/header.html` and `source/footer.html`
and are shared by every page — change once, rebuild, and it propagates.

### The catalogue

All product data is a single array in `source/core.js` (`CATALOGUE`). Each entry drives the
shop grid, the product page, the homepage carousels and the mega menus. Adding a watch means
adding one object.

Prices are held in AED. GBP is derived at render time from `RATE` in `source/core.js` —
replace that constant with a live feed before launch.

## Known placeholders

- UK address and both phone numbers
- Team names and portraits (`about.html`)
- Maps (`visit.html`)
- Journal article images
- Most product photography — every empty frame carries an art-direction brief describing
  the shot required

## Deployment

Vercel, zero-config static. `vercel.json` sets clean URLs, immutable caching on `/assets`,
and basic security headers.
