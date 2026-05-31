# VP Fotografija — Photography Portfolio

A responsive, multi-page photography portfolio website built with vanilla HTML, CSS, and JavaScript. Features a live gallery with likes, a booking contact form, service pricing, interactive games, and a customisable theme system.

---

## Pages

| File | Description |
|------|-------------|
| [index.html](index.html) | Landing page — hero, about, achievement cards, mini gallery |
| [portfolio.html](portfolio.html) | Photo gallery with category filters and a review system |
| [paslaugos.html](paslaugos.html) | Services and pricing tables |
| [kontaktai.html](kontaktai.html) | Booking form with full client-side validation |
| [nustatymai.html](nustatymai.html) | Theme customisation (background, heading colour & size) |
| [zaidimas.html](zaidimas.html) | Three interactive photography-themed mini-games |

---

## Features

- **Responsive design** — mobile-first layout with four CSS breakpoints (400 / 768 / 1200 / 1600 px)
- **Portfolio filtering** — tab-based category filter (weddings / portraits / nature / events) powered by Bootstrap Nav Pills
- **Photo modal** — click any photo to open a full-size viewer; keyboard `Escape` closes it
- **Like counter** — per-photo likes persist across page loads via `localStorage`
- **Review system** — star-rating form; reviews stored in `localStorage` and sorted newest-first
- **Booking form** — 11 fields with real-time validation (regex for email & phone), success/error modal feedback
- **Theme settings** — choose background colour (8 options), heading colour (8 options), and heading size (4 options); settings applied before first render to prevent flash
- **Privacy policy modal** — GDPR-compliant, triggered from footer link, closeable with `Escape` or backdrop click
- **Mini-games** — Memory card matching, photography quiz (15 questions, 3 difficulty levels), reaction-time test

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5, semantic elements |
| Styling | CSS3 custom properties, Flexbox, Grid |
| UI components | Bootstrap 5.3 (CDN) + Bootstrap Icons 1.11 |
| Scripting | Vanilla JavaScript (ES6, IIFE modules) |
| Persistence | `localStorage` (likes, reviews, settings) |
| Images | Unsplash CDN |

No build tools, no npm — open any HTML file directly in a browser.

---

## Project Structure

```
Fotografo_Portfolio/
├── index.html
├── portfolio.html
├── paslaugos.html
├── kontaktai.html
├── nustatymai.html
├── zaidimas.html
├── styles.css
└── js/
    ├── atsiliepimai.js        # Review form + localStorage persistence
    ├── form-validation.js     # Contact form validation + modals
    ├── gallery-heart-modal.js # Photo modal + like counter
    ├── nustatymai-handler.js  # Settings page controller
    ├── nustatymai.js          # Apply saved settings on page load
    ├── portfolio-filters.js   # Category filtering
    ├── privatumo-politika.js  # Privacy policy modal (GDPR)
    └── zaidimas.js            # Three mini-games
```

---

## localStorage Keys

| Key | Used by | Purpose |
|-----|---------|---------|
| `atsiliepimai` | `atsiliepimai.js` | Stored review objects |
| `likes_<title>` | `gallery-heart-modal.js` | Per-photo like counts |
| `fontoSpalva` | `nustatymai.js` | Saved background colour |
| `antrascioSpalva` | `nustatymai.js` | Saved heading colour |
| `antrascioStandis` | `nustatymai.js` | Saved heading size |

---

## Getting Started

No installation required.

1. Clone or download the repository.
2. Open `index.html` in any modern browser.
3. All features work offline except the Unsplash images (CDN).

```bash
git clone https://github.com/softchad/fotografija-portfolio.git
cd fotografija-portfolio
# open index.html in your browser
```

---

## License

&copy; 2026 VP Fotografija. All rights reserved.
