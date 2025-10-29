# MarketSeat

Auction-based marketplace prototype for sports tickets. Sellers list with a reserve and optional Buy Now; buyers bid to market value.

## Live Site

- Deployed on Vercel: https://market-seat.vercel.app/

## Product Requirements Document (PRD)

- PRD location: [projectDocs/PRD.md](projectDocs/PRD.md)

## Overview
- Tech: Vanilla HTML, CSS, JavaScript (no frameworks)
- Prototype features:
  - Create listing with reserve and optional Buy Now
  - Bidding with minimum increments and validation
  - Live auction countdown
  - Browse and filter by sport and event
- Files:
  - `index.html`, `styles.css`, `script.js`, `vercel.json`

## Getting Started (Local)

- Open `index.html` directly in a browser, or:
```
python3 -m http.server 5500
# visit http://localhost:5500/index.html
```

## Deploying to Vercel

- Push this repo to GitHub, then import it in Vercel as a static site (no build step).
- Ensure `index.html` is at the root. Update the Live Site link above with the deployed URL.
