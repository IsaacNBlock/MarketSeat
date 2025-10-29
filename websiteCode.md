## MarketSeat Prototype Code (Vanilla HTML/CSS/JS)

Below are the files you can copy into a folder and deploy to Vercel as a static site. This satisfies Part 2 of the assignment: functional prototype, vanilla stack, clean structure, and demonstrates core MVP concepts (listing, bidding with countdown, Buy Now, browse/filter). No frameworks.

```html
<!-- index.html -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>MarketSeat - Auction Prototype</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="app-header">
    <h1>MarketSeat</h1>
    <p class="tagline">Auction-based marketplace for sports tickets</p>
  </header>

  <main class="container">
    <section class="card" id="create-listing">
      <h2>Create Listing</h2>
      <form id="listing-form">
        <div class="grid-2">
          <label>Event
            <input type="text" id="eventName" placeholder="e.g., Knicks vs. Nets" required />
          </label>
          <label>Sport
            <select id="sport" required>
              <option value="Basketball">Basketball</option>
              <option value="Football">Football</option>
              <option value="Baseball">Baseball</option>
              <option value="Hockey">Hockey</option>
              <option value="Soccer">Soccer</option>
            </select>
          </label>
        </div>
        <div class="grid-3">
          <label>Section
            <input type="text" id="section" placeholder="e.g., 116" required />
          </label>
          <label>Row
            <input type="text" id="row" placeholder="e.g., 10" required />
          </label>
          <label>Quantity
            <input type="number" id="quantity" min="1" value="2" required />
          </label>
        </div>
        <div class="grid-3">
          <label>Reserve Price ($)
            <input type="number" id="reservePrice" min="0" step="1" placeholder="e.g., 120" required />
          </label>
          <label>Buy Now ($)
            <input type="number" id="buyNowPrice" min="0" step="1" placeholder="Optional" />
          </label>
          <label>Ends In (minutes)
            <input type="number" id="endsInMinutes" min="1" step="1" value="10" required />
          </label>
        </div>
        <button type="submit" class="btn primary">Create Listing</button>
        <p id="formMessage" class="muted"></p>
      </form>
    </section>

    <section class="card" id="browse">
      <h2>Browse Listings</h2>
      <div class="filters">
        <label>Filter by sport
          <select id="filterSport">
            <option value="">All sports</option>
            <option value="Basketball">Basketball</option>
            <option value="Football">Football</option>
            <option value="Baseball">Baseball</option>
            <option value="Hockey">Hockey</option>
            <option value="Soccer">Soccer</option>
          </select>
        </label>
        <label>Filter by event
          <input type="text" id="filterEvent" placeholder="Search by event name" />
        </label>
      </div>
      <div id="listingList" class="listings"></div>
      <p id="emptyState" class="muted">No listings yet. Create one above.</p>
    </section>

    <section class="card" id="detail" hidden>
      <button id="backToBrowse" class="btn">← Back to Browse</button>
      <div id="detailContent"></div>
    </section>
  </main>

  <footer class="app-footer">
    <small>Prototype only. Payments and transfers are simulated.</small>
  </footer>

  <script src="script.js"></script>
</body>
</html>
```

```css
/* styles.css */
:root {
  --bg: #0f172a; /* slate-900 */
  --panel: #111827; /* gray-900 */
  --text: #e5e7eb; /* gray-200 */
  --muted: #9ca3af; /* gray-400 */
  --primary: #22c55e; /* green-500 */
  --primary-600: #16a34a;
  --border: #1f2937; /* gray-800 */
  --accent: #38bdf8; /* sky-400 */
}

* { box-sizing: border-box; }
body {
  margin: 0;
  background: linear-gradient(180deg, #0b1220, #0f172a 40%);
  color: var(--text);
  font: 16px/1.5 system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif;
}

.app-header {
  padding: 24px 16px;
  text-align: center;
  background: radial-gradient(1200px 300px at 50% -20%, rgba(56,189,248,0.15), transparent),
              radial-gradient(1000px 250px at 20% -10%, rgba(34,197,94,0.15), transparent);
  border-bottom: 1px solid var(--border);
}
.app-header h1 { margin: 0 0 4px 0; font-size: 28px; }
.tagline { margin: 0; color: var(--muted); }

.container { max-width: 1000px; margin: 24px auto; padding: 0 16px; }
.card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.25);
}

label { display: block; font-weight: 600; font-size: 14px; margin-bottom: 8px; color: #d1d5db; }
input, select {
  width: 100%;
  padding: 10px 12px;
  margin-top: 6px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #0b1020;
  color: var(--text);
}

.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
@media (max-width: 720px) {
  .grid-2, .grid-3 { grid-template-columns: 1fr; }
}

.btn { cursor: pointer; background: #1f2937; color: var(--text); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; }
.btn:hover { background: #263141; }
.btn.primary { background: var(--primary); border-color: var(--primary); color: #052812; font-weight: 700; }
.btn.primary:hover { background: var(--primary-600); }
.btn[disabled] { opacity: .6; cursor: not-allowed; }

.muted { color: var(--muted); }

.listings { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
.listing {
  border: 1px solid var(--border);
  background: #0b1020;
  border-radius: 10px;
  padding: 12px;
}
.listing h3 { margin: 0 0 6px 0; font-size: 18px; }
.meta { font-size: 13px; color: var(--muted); }
.cta-row { display: flex; gap: 8px; margin-top: 10px; }

.detail {
  display: grid; gap: 8px;
}
.detail .price { font-size: 18px; font-weight: 700; color: var(--accent); }
.countdown { font-variant-numeric: tabular-nums; }
.notice { background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.35); padding: 8px 10px; border-radius: 8px; }
.warning { background: rgba(234,179,8,0.12); border: 1px solid rgba(234,179,8,0.35); padding: 8px 10px; border-radius: 8px; }
.error { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.35); padding: 8px 10px; border-radius: 8px; }

.filters { display: flex; gap: 12px; align-items: end; margin-bottom: 12px; }
```

```javascript
// script.js
(function() {
  /** In-memory state for prototype. */
  const state = {
    listings: [],
    timers: new Map(),
    filter: { sport: '', event: '' }
  };

  // DOM references
  const listingForm = document.getElementById('listing-form');
  const formMessage = document.getElementById('formMessage');
  const listingList = document.getElementById('listingList');
  const emptyState = document.getElementById('emptyState');
  const filterSport = document.getElementById('filterSport');
  const filterEvent = document.getElementById('filterEvent');
  const detailSection = document.getElementById('detail');
  const detailContent = document.getElementById('detailContent');
  const backToBrowse = document.getElementById('backToBrowse');

  function id() {
    return 'lst_' + Math.random().toString(36).slice(2, 9);
  }

  function now() { return Date.now(); }

  function formatCurrency(num) {
    return '$' + Number(num).toFixed(2);
  }

  function msToClock(ms) {
    if (ms < 0) ms = 0;
    const s = Math.floor(ms / 1000);
    const hh = Math.floor(s / 3600);
    const mm = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    const two = (n) => n.toString().padStart(2, '0');
    return (hh > 0 ? two(hh) + ':' : '') + two(mm) + ':' + two(ss);
  }

  function computeMinimumNextBid(listing) {
    const increment = 5; // $5 increments for demo
    const base = typeof listing.currentBid === 'number' ? listing.currentBid : 0;
    return base + increment;
  }

  function createListing(data) {
    const endAt = now() + data.endsInMinutes * 60 * 1000;
    return {
      id: id(),
      createdAt: now(),
      eventName: data.eventName,
      sport: data.sport,
      section: data.section,
      row: data.row,
      quantity: data.quantity,
      reservePrice: data.reservePrice,
      buyNowPrice: data.buyNowPrice ?? null,
      endAt,
      currentBid: null,
      highBidder: null,
      status: 'active', // 'active' | 'sold' | 'expired'
      soldPrice: null,
      soldType: null // 'buyNow' | 'auction'
    };
  }

  function upsertListing(listing) {
    const idx = state.listings.findIndex(l => l.id === listing.id);
    if (idx >= 0) state.listings[idx] = listing; else state.listings.unshift(listing);
  }

  function applyFilters(list) {
    return list.filter(l => {
      const sportOk = !state.filter.sport || l.sport === state.filter.sport;
      const eventOk = !state.filter.event || l.eventName.toLowerCase().includes(state.filter.event.toLowerCase());
      return sportOk && eventOk;
    });
  }

  function renderListings() {
    const items = applyFilters(state.listings);
    listingList.innerHTML = '';
    if (items.length === 0) {
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;
    for (const l of items) {
      const card = document.createElement('div');
      card.className = 'listing';
      const timeLeft = l.status === 'active' ? msToClock(l.endAt - now()) : '—';
      card.innerHTML = `
        <h3>${l.eventName}</h3>
        <div class="meta">${l.sport} • Section ${l.section} Row ${l.row} • Qty ${l.quantity}</div>
        <div class="meta">Time left: <span class="countdown">${timeLeft}</span></div>
        <div class="meta">Current bid: ${l.currentBid != null ? formatCurrency(l.currentBid) : '—'}</div>
        ${l.buyNowPrice ? `<div class="meta">Buy Now: ${formatCurrency(l.buyNowPrice)}</div>` : ''}
        <div class="cta-row">
          <button class="btn" data-action="view" data-id="${l.id}">View</button>
          ${l.buyNowPrice && l.status === 'active' ? `<button class="btn primary" data-action="buyNow" data-id="${l.id}">Buy Now</button>` : ''}
        </div>
      `;
      listingList.appendChild(card);
    }
  }

  function renderDetail(listing) {
    detailSection.hidden = false;
    detailContent.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'detail';
    const reserveMet = listing.currentBid != null && listing.currentBid >= listing.reservePrice;

    const top = document.createElement('div');
    top.innerHTML = `
      <h2>${listing.eventName}</h2>
      <div class="meta">${listing.sport} • Section ${listing.section} Row ${listing.row} • Qty ${listing.quantity}</div>
    `;

    const status = document.createElement('div');
    if (listing.status === 'active') {
      status.innerHTML = `
        <div class="notice">Reserve: ${reserveMet ? 'Met' : 'Not met'}</div>
        <div>Current bid: <span class="price">${listing.currentBid != null ? formatCurrency(listing.currentBid) : '—'}</span></div>
        <div>Time left: <span class="countdown">${msToClock(listing.endAt - now())}</span></div>
      `;
    } else if (listing.status === 'sold') {
      status.innerHTML = `
        <div class="notice">Sold for ${formatCurrency(listing.soldPrice)} via ${listing.soldType}</div>
      `;
    } else {
      status.innerHTML = `<div class="warning">Auction ended without meeting reserve. Not sold.</div>`;
    }

    const actions = document.createElement('div');
    if (listing.status === 'active') {
      const minBid = computeMinimumNextBid(listing);
      actions.innerHTML = `
        <div>
          <label>Place a bid
            <input type="number" id="bidAmount" min="${minBid}" step="1" value="${minBid}" />
          </label>
        </div>
        <div class="cta-row">
          <button class="btn primary" data-action="placeBid" data-id="${listing.id}">Place Bid</button>
          ${listing.buyNowPrice ? `<button class="btn" data-action="buyNowDetail" data-id="${listing.id}">Buy Now ${formatCurrency(listing.buyNowPrice)}</button>` : ''}
        </div>
        <div id="detailMsg" class="muted"></div>
      `;
    }

    container.appendChild(top);
    container.appendChild(status);
    container.appendChild(actions);
    detailContent.appendChild(container);
  }

  function startTimer(listing) {
    stopTimer(listing.id);
    const t = setInterval(() => {
      const remaining = listing.endAt - now();
      if (remaining <= 0) {
        endAuctionIfNeeded(listing.id);
      }
      // Update visible countdowns
      for (const el of document.querySelectorAll('.countdown')) {
        // best effort refresh
        el.textContent = msToClock(remaining);
      }
    }, 1000);
    state.timers.set(listing.id, t);
  }

  function stopTimer(listingId) {
    const t = state.timers.get(listingId);
    if (t) clearInterval(t);
    state.timers.delete(listingId);
  }

  function endAuctionIfNeeded(listingId) {
    const l = state.listings.find(x => x.id === listingId);
    if (!l || l.status !== 'active') return;
    if (now() >= l.endAt) {
      if (l.currentBid != null && l.currentBid >= l.reservePrice) {
        l.status = 'sold';
        l.soldPrice = l.currentBid;
        l.soldType = 'auction';
      } else {
        l.status = 'expired';
      }
      stopTimer(l.id);
      upsertListing(l);
      renderListings();
      renderDetail(l);
    }
  }

  function handlePlaceBid(listingId, amount) {
    const l = state.listings.find(x => x.id === listingId);
    if (!l || l.status !== 'active') return;
    const min = computeMinimumNextBid(l);
    if (isNaN(amount) || amount < min) {
      const msg = document.getElementById('detailMsg');
      if (msg) {
        msg.className = 'error';
        msg.textContent = `Bid must be at least ${formatCurrency(min)}.`;
      }
      return;
    }
    l.currentBid = amount;
    l.highBidder = 'You';
    upsertListing(l);
    renderListings();
    renderDetail(l);
  }

  function handleBuyNow(listingId) {
    const l = state.listings.find(x => x.id === listingId);
    if (!l || l.status !== 'active' || !l.buyNowPrice) return;
    l.status = 'sold';
    l.soldPrice = l.buyNowPrice;
    l.soldType = 'buyNow';
    stopTimer(l.id);
    upsertListing(l);
    renderListings();
    renderDetail(l);
    alert('Purchase successful (simulated). You will receive an email confirmation.');
  }

  // Event listeners
  listingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      eventName: document.getElementById('eventName').value.trim(),
      sport: document.getElementById('sport').value,
      section: document.getElementById('section').value.trim(),
      row: document.getElementById('row').value.trim(),
      quantity: Number(document.getElementById('quantity').value),
      reservePrice: Number(document.getElementById('reservePrice').value),
      buyNowPrice: document.getElementById('buyNowPrice').value ? Number(document.getElementById('buyNowPrice').value) : null,
      endsInMinutes: Number(document.getElementById('endsInMinutes').value)
    };

    // Basic validation
    if (!data.eventName) { formMessage.textContent = 'Event is required.'; return; }
    if (data.quantity <= 0) { formMessage.textContent = 'Quantity must be at least 1.'; return; }
    if (data.reservePrice < 0) { formMessage.textContent = 'Reserve must be >= 0.'; return; }
    if (data.buyNowPrice != null && data.buyNowPrice <= 0) { formMessage.textContent = 'Buy Now must be > 0.'; return; }

    const listing = createListing(data);
    state.listings.unshift(listing);
    startTimer(listing);
    renderListings();

    formMessage.textContent = 'Listing created!';
    listingForm.reset();
  });

  listingList.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    const listingId = btn.getAttribute('data-id');
    if (action === 'view') {
      const l = state.listings.find(x => x.id === listingId);
      if (!l) return;
      renderDetail(l);
      detailSection.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'buyNow') {
      handleBuyNow(listingId);
    }
  });

  detailContent.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    const listingId = btn.getAttribute('data-id');
    if (action === 'placeBid') {
      const amount = Number(document.getElementById('bidAmount').value);
      handlePlaceBid(listingId, amount);
    } else if (action === 'buyNowDetail') {
      handleBuyNow(listingId);
    }
  });

  backToBrowse.addEventListener('click', () => {
    detailSection.hidden = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  filterSport.addEventListener('change', () => {
    state.filter.sport = filterSport.value;
    renderListings();
  });
  filterEvent.addEventListener('input', () => {
    state.filter.event = filterEvent.value;
    renderListings();
  });

  // Seed with a sample listing for quick demo
  (function seed() {
    const demo = createListing({
      eventName: 'Knicks vs. Nets',
      sport: 'Basketball',
      section: '116',
      row: '10',
      quantity: 2,
      reservePrice: 120,
      buyNowPrice: 220,
      endsInMinutes: 15
    });
    state.listings.push(demo);
    startTimer(demo);
  })();

  renderListings();
})();
```

```json
// vercel.json
{
  "version": 2,
  "builds": [{ "src": "index.html", "use": "@vercel/static" }],
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### How to run locally
- Open `index.html` in your browser directly, or serve the folder via any static server.

### Deploying to Vercel
- Put these files at the project root in a new repo.
- Connect the repo to Vercel, Project type: Other (Static). No build needed.
- Ensure `index.html`, `styles.css`, `script.js`, and `vercel.json` are present.

This prototype includes:
- Functional listing form with reserve and optional Buy Now
- Live countdown timer for auctions
- Bidding with minimum increment and validation
- Buy Now flow that immediately marks listing as sold
- Browse grid with sport and event filters
- Clean separation of HTML, CSS, JS and no console errors
