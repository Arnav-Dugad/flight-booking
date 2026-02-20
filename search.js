/* ================================================================
   ARNAV FLIGHTS — Search & Results Logic
   ================================================================ */

'use strict';

/* ── Flight Data ─────────────────────────────────────────────────── */
const FLIGHTS = [
  {
    id: 'AI301',
    airline: 'Air India',
    code: 'AI',
    color: 'ai-color',
    flightNum: 'AI-301',
    dep: '06:15', arr: '09:30',
    depCode: 'DEL', arrCode: 'BOM',
    duration: '2h 15m',
    stops: 0,
    price: 4850,
    originalPrice: 6200,
    class: 'Economy',
    tags: ['Free Meal', 'USB Charging'],
    baggage: '15kg',
    refundable: true,
  },
  {
    id: 'IG2401',
    airline: 'IndiGo',
    code: 'IG',
    color: 'ig-color',
    flightNum: '6E-2401',
    dep: '08:45', arr: '11:50',
    depCode: 'DEL', arrCode: 'BOM',
    duration: '2h 05m',
    stops: 0,
    price: 3200,
    originalPrice: 4100,
    class: 'Economy',
    tags: ['On Time+', 'Low Price'],
    baggage: '15kg',
    refundable: false,
  },
  {
    id: 'SG801',
    airline: 'SpiceJet',
    code: 'SG',
    color: 'sg-color',
    flightNum: 'SG-801',
    dep: '11:20', arr: '14:40',
    depCode: 'DEL', arrCode: 'BOM',
    duration: '2h 20m',
    stops: 0,
    price: 2950,
    originalPrice: 3800,
    class: 'Economy',
    tags: ['Value Deal'],
    baggage: '15kg',
    refundable: false,
  },
  {
    id: 'EK508',
    airline: 'Emirates',
    code: 'EK',
    color: 'ek-color',
    flightNum: 'EK-508',
    dep: '14:30', arr: '17:05',
    depCode: 'DEL', arrCode: 'DXB',
    duration: '3h 35m',
    stops: 0,
    price: 18500,
    originalPrice: 24000,
    class: 'Business',
    tags: ['Lie-flat Seat', 'Gourmet Dining', 'Priority'],
    baggage: '30kg',
    refundable: true,
  },
  {
    id: 'LH762',
    airline: 'Lufthansa',
    code: 'LH',
    color: 'lh-color',
    flightNum: 'LH-762',
    dep: '02:15', arr: '08:40',
    depCode: 'DEL', arrCode: 'FRA',
    duration: '8h 25m',
    stops: 0,
    price: 52000,
    originalPrice: 68000,
    class: 'Economy',
    tags: ['Meal Included', 'Extra Legroom'],
    baggage: '23kg',
    refundable: true,
  },
  {
    id: 'SQ407',
    airline: 'Singapore Airlines',
    code: 'SQ',
    color: 'sq-color',
    flightNum: 'SQ-407',
    dep: '23:55', arr: '08:20+1',
    depCode: 'DEL', arrCode: 'SIN',
    duration: '5h 25m',
    stops: 0,
    price: 32000,
    originalPrice: 42000,
    class: 'Economy',
    tags: ['Award Winning', 'Gourmet Meal', 'WiFi'],
    baggage: '30kg',
    refundable: true,
  },
  {
    id: 'QR551',
    airline: 'Qatar Airways',
    code: 'QR',
    color: 'qr-color',
    flightNum: 'QR-551',
    dep: '03:40', arr: '07:00',
    depCode: 'BOM', arrCode: 'DOH',
    duration: '4h 50m',
    stops: 0,
    price: 22000,
    originalPrice: 29000,
    class: 'Business',
    tags: ['World\'s Best', 'Q-Suite', 'Champagne'],
    baggage: '30kg',
    refundable: true,
  },
  {
    id: 'BA117',
    airline: 'British Airways',
    code: 'BA',
    color: 'ba-color',
    flightNum: 'BA-117',
    dep: '10:25', arr: '15:40',
    depCode: 'DEL', arrCode: 'LHR',
    duration: '9h 15m',
    stops: 0,
    price: 61000,
    originalPrice: 78000,
    class: 'Economy',
    tags: ['Direct', 'Lounge Access'],
    baggage: '23kg',
    refundable: true,
  },
  {
    id: 'AI506',
    airline: 'Air India',
    code: 'AI',
    color: 'ai-color',
    flightNum: 'AI-506',
    dep: '16:50', arr: '22:10',
    depCode: 'BLR', arrCode: 'DEL',
    duration: '2h 20m',
    stops: 0,
    price: 5100,
    originalPrice: 6800,
    class: 'Economy',
    tags: ['Free Meal', 'Spacious'],
    baggage: '15kg',
    refundable: true,
  },
  {
    id: 'IG4523',
    airline: 'IndiGo',
    code: 'IG',
    color: 'ig-color',
    flightNum: '6E-4523',
    dep: '18:30', arr: '21:10',
    depCode: 'BOM', arrCode: 'HYD',
    duration: '1h 40m',
    stops: 0,
    price: 2400,
    originalPrice: 3100,
    class: 'Economy',
    tags: ['Best Price'],
    baggage: '15kg',
    refundable: false,
  },
  {
    id: 'EK232',
    airline: 'Emirates',
    code: 'EK',
    color: 'ek-color',
    flightNum: 'EK-232',
    dep: '09:05', arr: '11:35',
    depCode: 'BOM', arrCode: 'DXB',
    duration: '3h 30m',
    stops: 0,
    price: 15800,
    originalPrice: 21000,
    class: 'Economy',
    tags: ['ICE Entertainment', 'Meal'],
    baggage: '25kg',
    refundable: true,
  },
  {
    id: 'SG422',
    airline: 'SpiceJet',
    code: 'SG',
    color: 'sg-color',
    flightNum: 'SG-422',
    dep: '07:00', arr: '09:45',
    depCode: 'DEL', arrCode: 'MAA',
    duration: '2h 45m',
    stops: 1,
    price: 3600,
    originalPrice: 4900,
    class: 'Economy',
    tags: ['1 Stop', 'Budget'],
    baggage: '15kg',
    refundable: false,
  },
];

/* ── Render Flight Cards ─────────────────────────────────────────── */
function renderFlights(flights) {
  const container = document.getElementById('flightsList');
  if (!container) return;

  if (!flights.length) {
    container.innerHTML = `
      <div class="glass-card" style="padding:60px;text-align:center;">
        <div style="font-size:3rem;margin-bottom:16px;">✈️</div>
        <h3 style="font-size:1.25rem;margin-bottom:8px;color:var(--text-1)">No flights found</h3>
        <p style="color:var(--text-4);font-size:0.875rem">Try adjusting your filters or search for different dates.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = flights.map((f, i) => `
    <div class="flight-card reveal" style="--delay:${i * 0.06}s; transition-delay: ${i * 0.06}s"
         onclick="selectFlight('${f.id}')">
      <div class="flight-card-main">

        <!-- Airline info -->
        <div class="airline-info">
          <div class="airline-logo-sm ${f.color}">${f.code}</div>
          <div class="airline-info-text">
            <div class="airline-info-name">${f.airline}</div>
            <div class="airline-info-flight">${f.flightNum}</div>
          </div>
        </div>

        <!-- Route -->
        <div class="flight-route">
          <div class="route-time">
            <div class="route-time-main">${f.dep}</div>
            <div class="route-time-code">${f.depCode}</div>
          </div>
          <div class="route-line">
            <div class="route-duration">${f.duration}</div>
            <div class="route-line-track">
              <span class="route-plane">✈</span>
            </div>
            <div class="route-stops">
              <span class="stops-${f.stops}">${f.stops === 0 ? 'Non-stop' : f.stops === 1 ? '1 Stop' : '2 Stops'}</span>
            </div>
          </div>
          <div class="route-time">
            <div class="route-time-main">${f.arr}</div>
            <div class="route-time-code">${f.arrCode}</div>
          </div>
        </div>

        <!-- Price -->
        <div class="flight-price">
          <div style="font-size:0.75rem;color:var(--text-4);text-decoration:line-through;text-align:right;">
            ₹${f.originalPrice.toLocaleString()}
          </div>
          <div class="price-amount">₹${f.price.toLocaleString()}</div>
          <div class="price-per">per person</div>
          <div class="price-class">${f.class}</div>
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); selectFlight('${f.id}')">
            Book Now
          </button>
        </div>

      </div>
      <div class="flight-card-footer">
        <div class="flight-card-tags">
          ${f.refundable ? '<span class="flight-tag flight-tag-green">✓ Refundable</span>' : '<span class="flight-tag">Non-refundable</span>'}
          <span class="flight-tag">🧳 ${f.baggage}</span>
          ${f.tags.map(t => `<span class="flight-tag flight-tag-gold">${t}</span>`).join('')}
        </div>
        <div style="font-size:0.75rem;color:var(--text-4)">
          ${Math.floor(Math.random() * 8) + 2} seats left
        </div>
      </div>
    </div>
  `).join('');

  // Trigger reveal for newly rendered cards
  setTimeout(() => {
    container.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }, 50);
}

/* ── Sorting ─────────────────────────────────────────────────────── */
const SORT_FNS = {
  price:     (a, b) => a.price - b.price,
  duration:  (a, b) => a.duration.localeCompare(b.duration),
  departure: (a, b) => a.dep.localeCompare(b.dep),
  arrival:   (a, b) => a.arr.localeCompare(b.arr),
};

let currentSort = 'price';
let currentFlights = [...FLIGHTS];

window.sortFlights = function(key) {
  currentSort = key;
  applyFiltersAndSort();
};

/* ── Filtering ───────────────────────────────────────────────────── */
window.applyFiltersAndSort = function() {
  const priceMax = parseInt(document.getElementById('priceRange')?.value ?? 999999);
  const checkedAirlines = [...document.querySelectorAll('.airline-filter.checked')].map(el => el.dataset.airline);
  const checkedStops    = [...document.querySelectorAll('.stops-filter.checked')].map(el => parseInt(el.dataset.stops));
  const checkedTimes    = [...document.querySelectorAll('.time-filter.checked')].map(el => el.dataset.time);

  let filtered = FLIGHTS.filter(f => {
    if (f.price > priceMax) return false;
    if (checkedAirlines.length && !checkedAirlines.includes(f.code)) return false;
    if (checkedStops.length && !checkedStops.includes(f.stops)) return false;
    if (checkedTimes.length) {
      const hour = parseInt(f.dep.split(':')[0]);
      const matches = checkedTimes.some(t => {
        if (t === 'morning')   return hour >= 6  && hour < 12;
        if (t === 'afternoon') return hour >= 12 && hour < 18;
        if (t === 'evening')   return hour >= 18 && hour < 24;
        if (t === 'night')     return hour >= 0  && hour < 6;
        return true;
      });
      if (!matches) return false;
    }
    return true;
  });

  filtered.sort(SORT_FNS[currentSort] || SORT_FNS.price);

  const countEl = document.querySelector('[data-results-count]');
  if (countEl) countEl.textContent = filtered.length;

  renderFlights(filtered);
};

/* ── Price Range live update ─────────────────────────────────────── */
(function() {
  const slider = document.getElementById('priceRange');
  if (slider) slider.addEventListener('input', window.applyFiltersAndSort);
})();

/* ── Filter checkbox interactions ────────────────────────────────── */
document.addEventListener('click', e => {
  const box = e.target.closest('.checkbox');
  if (!box) return;
  box.classList.toggle('checked');
  window.applyFiltersAndSort?.();
});

/* ── Sort bar ────────────────────────────────────────────────────── */
document.addEventListener('click', e => {
  const opt = e.target.closest('.sort-option');
  if (!opt || !opt.dataset.sort) return;
  opt.closest('.sort-options')?.querySelectorAll('.sort-option').forEach(o => o.classList.remove('active'));
  opt.classList.add('active');
  window.sortFlights(opt.dataset.sort);
});

/* ── Booking data ────────────────────────────────────────────────── */
window.getBookingFlight = function() {
  const raw = sessionStorage.getItem('bookingData');
  if (!raw) return FLIGHTS[0];
  try {
    const data = JSON.parse(raw);
    return FLIGHTS.find(f => f.id === data.selectedFlight) || FLIGHTS[0];
  } catch { return FLIGHTS[0]; }
};

window.populateBookingSummary = function() {
  const flight = window.getBookingFlight();
  if (!flight) return;

  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl('summaryAirline',  flight.airline);
  setEl('summaryFlight',   flight.flightNum);
  setEl('summaryDep',      `${flight.dep} ${flight.depCode}`);
  setEl('summaryArr',      `${flight.arr} ${flight.arrCode}`);
  setEl('summaryDuration', flight.duration);
  setEl('summaryClass',    flight.class);
  setEl('summaryBaggage',  flight.baggage);

  const params = window.loadSearchParams?.() || {};
  const pax = parseInt(params.pax ?? 1);
  const base = flight.price * pax;
  const taxes = Math.round(base * 0.12);
  const fees = 350;
  const total = base + taxes + fees;

  setEl('summaryBase',   `₹${base.toLocaleString()}`);
  setEl('summaryTaxes',  `₹${taxes.toLocaleString()}`);
  setEl('summaryFees',   `₹${fees.toLocaleString()}`);
  setEl('summaryTotal',  `₹${total.toLocaleString()}`);

  // also save total for confirmation
  sessionStorage.setItem('bookingTotal', total);
  sessionStorage.setItem('bookingFlight', JSON.stringify(flight));
};

/* ── Confirmation page ───────────────────────────────────────────── */
window.populateConfirmation = function() {
  const flight = JSON.parse(sessionStorage.getItem('bookingFlight') || 'null') || FLIGHTS[0];
  const total  = sessionStorage.getItem('bookingTotal') || '0';
  const ref    = 'AF' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  setEl('confRef',       ref);
  setEl('confAirline',   flight.airline);
  setEl('confFlight',    flight.flightNum);
  setEl('confFrom',      flight.depCode);
  setEl('confTo',        flight.arrCode);
  setEl('confDep',       flight.dep);
  setEl('confArr',       flight.arr);
  setEl('confDuration',  flight.duration);
  setEl('confClass',     flight.class);
  setEl('confTotal',     `₹${parseInt(total).toLocaleString()}`);
  setEl('confDate',      new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }));

  // Launch confetti
  setTimeout(window.launchConfetti, 500);
  sessionStorage.removeItem('bookingData');
};

/* ── Init results page ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('flightsList')) {
    window.applyFiltersAndSort();
  }
  if (document.getElementById('summaryTotal')) {
    window.populateBookingSummary();
  }
  if (document.getElementById('confRef')) {
    window.populateConfirmation();
  }
});
