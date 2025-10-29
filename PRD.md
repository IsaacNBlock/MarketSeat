## Executive Summary

**Product name**: MarketSeat

**Elevator pitch**: MarketSeat is an auction-based marketplace for sports tickets that lets sellers list seats with a reserve price and optional Buy Now while buyers bid to true market value. It eliminates constant manual repricing and clears tickets at fair prices quickly.

**Core problem**: Third‑party ticket platforms rely on fixed, seller-set prices, forcing sellers to constantly adjust to the market and making discovery of fair market value inefficient for buyers.

## Problem Statement & Opportunity

Sellers of sports tickets (season ticket holders, casual resellers) currently list at fixed prices on major marketplaces. Because demand is time‑sensitive and volatile, sellers must repeatedly lower or raise prices to chase market value, risking unsold inventory or leaving money on the table. Buyers have limited ability to express demand except by purchasing at the posted price.

- **Who is affected**: Individual ticket holders and small resellers who need timely liquidity; fans seeking fair prices for upcoming games.
- **Frequency/impact**: Pricing pressure intensifies as event dates approach; frequent repricing creates friction and frustration, and mispricing leads to financial loss or unsold seats.
- **Current alternatives**: StubHub, SeatGeek, Vivid Seats and team exchanges emphasize fixed prices; “Make an offer” is inconsistent and opaque, and true auctions are rare or non-existent for regular listings.
- **Opportunity**: An auction with optional Buy Now clears at market value automatically, reduces seller overhead, and increases buyer engagement through competitive bidding.

## Target Users & Personas

1) **Sam the Seller (Season Ticket Holder)**
- Context: Owns a partial/season plan; can’t attend every game.
- Needs: Fast, fair sales without micromanaging prices; protection via reserve price; option to accept a Buy Now.
- Why this product: Auctions surface true demand while Buy Now provides instant liquidity.

2) **Bree the Bargain‑Hunting Buyer (Avid Fan)**
- Context: Monitors prices across sites; flexible on sections if the deal is good.
- Needs: Transparent bidding, notifications, chance to win below inflated list prices; immediate purchase when necessary.
- Why this product: Competitive bidding plus Buy Now gives control over speed vs. price.

## MVP Feature Specifications

Include 4 core features that demonstrate the concept while remaining buildable quickly.

1) **Create Listing with Reserve and Buy Now**
- User story: As a seller, I want to list tickets with a reserve price and optional Buy Now so that I’m protected while enabling instant purchase.
- Acceptance criteria:
  - Seller can enter event, section/row/seat, quantity, reserve price, auction end time, and optional Buy Now price.
  - Listing displays reserve status (not the value) and Buy Now if enabled.
  - Submitting shows a confirmation with all entered details.

2) **Bidding & Auction Countdown**
- User story: As a buyer, I want to place bids and see a live countdown so that I know the current high bid and time remaining.
- Acceptance criteria:
  - Buyers can place a bid >= current minimum increment.
  - UI updates current high bid and time remaining without page reload.
  - On auction end, highest valid bid at/above reserve wins; otherwise, listing expires unsold.

3) **Buy Now (Instant Purchase) Option**
- User story: As a buyer, I want to instantly purchase via Buy Now if I don’t want to wait for the auction.
- Acceptance criteria:
  - If Buy Now is enabled, clicking Buy Now immediately ends the auction and marks the listing as sold.
  - Listing state updates to Sold with final price.
  - Buy Now is disabled once a Buy Now purchase completes.

4) **Browse & Basic Search**
- User story: As a buyer, I want to browse and filter listings by team/event/date so I can find relevant auctions.
- Acceptance criteria:
  - Listings page shows key attributes: event, date/time, section/row, current bid, Buy Now (if available), and time left.
  - Text search and simple filters (team/event, date) narrow results.
  - Clicking a listing opens a detail page with bidding/Buy Now actions.

## Future Roadmap

Week 2–3
- Allow posting events for different sports
- Add filtering by event on browse/search

Week 4–5
- Email notifications for successful purchases

Week 6
- Complete remaining features, have an AI suggest ticket prices

## Success Metrics

- Auction liquidity: % of listings that receive at least 1 bid and % that sell
- Time: sellers spend less time on the website listing their tickets
- Bid engagement: average bids per listing and outbid-to-rebid rate
- Revenue: Gross Merchandise Value (GMV) and take rate (fees) for sold listings

## Open Questions

- Fee model: Who pays what, and how much? Flat vs. percentage vs. hybrid?
- Reserve price policy: Show reserve met/not met only, or reveal values after bidding?
- Anti‑sniping parameters: How long should extensions be, and how many times can they trigger?
- Cancellation and dispute policy: When can sellers cancel? What’s buyer protection?
- Geography and events scope: Sports only at launch, or include concerts?

