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
