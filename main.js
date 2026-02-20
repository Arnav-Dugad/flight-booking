/* ================================================================
   ARNAV FLIGHTS — Main JavaScript
   ================================================================ */

'use strict';

/* ── Page Loader ─────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.add('page-enter');
    }, 600);
  }
});

/* ── Navigation ──────────────────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  let lastY = 0;
  let ticking = false;

  function updateNav() {
    const y = window.scrollY;
    if (y > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // Active link
  const links = nav.querySelectorAll('.nav-links a');
  const currentPath = location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ── Mobile Nav ──────────────────────────────────────────────────── */
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');
  if (!hamburger || !mobileNav) return;

  function openMenu() {
    mobileNav.classList.add('open');
    document.body.classList.add('no-scroll');
    hamburger.classList.add('open');
  }
  function closeMenu() {
    mobileNav.classList.remove('open');
    document.body.classList.remove('no-scroll');
    hamburger.classList.remove('open');
  }

  hamburger.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);

  mobileNav.addEventListener('click', e => {
    if (e.target === mobileNav) closeMenu();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ── Star Canvas ─────────────────────────────────────────────────── */
(function initStars() {
  const canvas = document.getElementById('starsCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let animFrame;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    generateStars();
  }

  function generateStars() {
    const count = Math.floor((canvas.width * canvas.height) / 5000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.008 + 0.002,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      const a = s.alpha * (0.6 + 0.4 * Math.sin(s.phase + t * s.speed));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fill();
    });
    animFrame = requestAnimationFrame(draw);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  animFrame = requestAnimationFrame(draw);
})();

/* ── Scroll Reveal ───────────────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ── Animated Counters ───────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el, target, suffix = '') {
    const duration = 1800;
    const start = performance.now();
    const isFloat = target % 1 !== 0;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = easeOutQuart(progress) * target;
      el.textContent = (isFloat ? value.toFixed(1) : Math.floor(value)).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
})();

/* ── Button Ripple Effect ────────────────────────────────────────── */
(function initRipple() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
    `;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
})();

/* ── Toast Notification ──────────────────────────────────────────── */
window.showToast = function(message, icon = '✈️', duration = 3500) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon"></span><span class="toast-text"></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector('.toast-icon').textContent = icon;
  toast.querySelector('.toast-text').textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), duration);
};

/* ── Passenger Counter ───────────────────────────────────────────── */
window.initPassengerCounter = function() {
  document.querySelectorAll('.passenger-control').forEach(ctrl => {
    const input = ctrl.querySelector('.passenger-val');
    const dec   = ctrl.querySelector('.passenger-dec');
    const inc   = ctrl.querySelector('.passenger-inc');
    if (!input || !dec || !inc) return;

    const min = parseInt(ctrl.dataset.min ?? 0);
    const max = parseInt(ctrl.dataset.max ?? 9);

    function update(delta) {
      let val = parseInt(input.value) + delta;
      val = Math.max(min, Math.min(max, val));
      input.value = val;
      dec.disabled = val <= min;
      inc.disabled = val >= max;
      // Update summary label if exists
      const summary = document.querySelector('[data-pax-summary]');
      if (summary) updatePaxSummary();
    }

    dec.addEventListener('click', () => update(-1));
    inc.addEventListener('click', () => update(+1));
    update(0);
  });
};

function updatePaxSummary() {
  const adults   = parseInt(document.querySelector('[data-pax="adults"] .passenger-val')?.value ?? 1);
  const children = parseInt(document.querySelector('[data-pax="children"] .passenger-val')?.value ?? 0);
  const infants  = parseInt(document.querySelector('[data-pax="infants"] .passenger-val')?.value ?? 0);
  const total = adults + children + infants;
  document.querySelectorAll('[data-pax-summary]').forEach(el => {
    el.textContent = `${total} Passenger${total !== 1 ? 's' : ''}`;
  });
}

/* ── Passenger Dropdown ──────────────────────────────────────────── */
(function initPaxDropdown() {
  const trigger = document.getElementById('paxTrigger');
  const dropdown = document.getElementById('paxDropdown');
  if (!trigger || !dropdown) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('open');
    dropdown.classList.toggle('open', !isOpen);
  });

  document.addEventListener('click', e => {
    if (!dropdown.contains(e.target) && e.target !== trigger) {
      dropdown.classList.remove('open');
    }
  });
})();

/* ── Date Picker Enhancements ────────────────────────────────────── */
(function initDates() {
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(inp => {
    inp.min = today;
    if (!inp.value) inp.value = getDefaultDate(inp.dataset.offset ?? 0);
  });

  function getDefaultDate(offset = 0) {
    const d = new Date();
    d.setDate(d.getDate() + parseInt(offset));
    return d.toISOString().split('T')[0];
  }

  // Sync return date to be >= departure date
  const dep = document.getElementById('depDate');
  const ret = document.getElementById('retDate');
  if (dep && ret) {
    dep.addEventListener('change', () => {
      ret.min = dep.value;
      if (ret.value && ret.value < dep.value) {
        const d = new Date(dep.value);
        d.setDate(d.getDate() + 1);
        ret.value = d.toISOString().split('T')[0];
      }
    });
  }
})();

/* ── Swap Origins ────────────────────────────────────────────────── */
window.swapLocations = function() {
  const from = document.getElementById('fromInput');
  const to   = document.getElementById('toInput');
  const fromCode = document.getElementById('fromCode');
  const toCode   = document.getElementById('toCode');
  if (!from || !to) return;

  [from.value, to.value] = [to.value, from.value];
  if (fromCode && toCode) {
    [fromCode.textContent, toCode.textContent] = [toCode.textContent, fromCode.textContent];
  }

  const swapBtn = document.querySelector('.swap-btn');
  if (swapBtn) {
    swapBtn.style.transform = 'rotate(180deg)';
    setTimeout(() => { swapBtn.style.transform = ''; }, 400);
  }
};

/* ── Autocomplete ────────────────────────────────────────────────── */
const AIRPORTS = [
  { code: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', flag: '🇮🇳' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj', city: 'Mumbai', flag: '🇮🇳' },
  { code: 'BLR', name: 'Kempegowda International', city: 'Bengaluru', flag: '🇮🇳' },
  { code: 'MAA', name: 'Chennai International', city: 'Chennai', flag: '🇮🇳' },
  { code: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad', flag: '🇮🇳' },
  { code: 'CCU', name: 'Netaji Subhas Chandra Bose', city: 'Kolkata', flag: '🇮🇳' },
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', flag: '🇦🇪' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', flag: '🇬🇧' },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', flag: '🇫🇷' },
  { code: 'NRT', name: 'Narita International', city: 'Tokyo', flag: '🇯🇵' },
  { code: 'SIN', name: 'Changi Airport', city: 'Singapore', flag: '🇸🇬' },
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', flag: '🇺🇸' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', flag: '🇺🇸' },
  { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', flag: '🇦🇺' },
  { code: 'DOH', name: 'Hamad International', city: 'Doha', flag: '🇶🇦' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', flag: '🇩🇪' },
  { code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', flag: '🇳🇱' },
  { code: 'ICN', name: 'Incheon International', city: 'Seoul', flag: '🇰🇷' },
  { code: 'PEK', name: 'Beijing Capital International', city: 'Beijing', flag: '🇨🇳' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', flag: '🇹🇭' },
];

window.initAutocomplete = function(inputId, dropdownId, codeId) {
  const input    = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  const codeEl   = document.getElementById(codeId);
  if (!input || !dropdown) return;

  function renderResults(query) {
    const filtered = AIRPORTS.filter(a =>
      a.city.toLowerCase().includes(query.toLowerCase()) ||
      a.code.toLowerCase().includes(query.toLowerCase()) ||
      a.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6);

    dropdown.innerHTML = filtered.map(a => `
      <div class="autocomplete-item" data-code="${a.code}" data-city="${a.city}">
        <div class="autocomplete-item-icon">${a.flag}</div>
        <div>
          <div class="autocomplete-item-name">${a.city}</div>
          <div class="autocomplete-item-code">${a.code} · ${a.name}</div>
        </div>
      </div>
    `).join('');

    dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
      item.addEventListener('click', () => {
        input.value = item.dataset.city;
        if (codeEl) codeEl.textContent = item.dataset.code;
        dropdown.classList.remove('open');
      });
    });
  }

  input.addEventListener('focus', () => {
    renderResults(input.value || '');
    dropdown.classList.add('open');
  });

  input.addEventListener('input', () => {
    renderResults(input.value);
    dropdown.classList.add('open');
  });

  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });
};

/* ── Trip Type Toggle ────────────────────────────────────────────── */
window.setTripType = function(type) {
  document.querySelectorAll('.search-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.type === type);
  });
  const returnField = document.getElementById('returnDateField');
  if (returnField) {
    returnField.style.display = type === 'one-way' ? 'none' : '';
  }
  // Save to session storage
  sessionStorage.setItem('tripType', type);
};

/* ── Filter checkboxes ───────────────────────────────────────────── */
(function initFilters() {
  document.querySelectorAll('.checkbox').forEach(box => {
    box.addEventListener('click', () => {
      box.classList.toggle('checked');
    });
  });
})();

/* ── Sort options ────────────────────────────────────────────────── */
(function initSort() {
  document.querySelectorAll('.sort-option').forEach(opt => {
    opt.addEventListener('click', () => {
      opt.closest('.sort-options')?.querySelectorAll('.sort-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });
})();

/* ── Price range ─────────────────────────────────────────────────── */
(function initPriceRange() {
  const slider = document.getElementById('priceRange');
  const display = document.getElementById('priceDisplay');
  if (!slider || !display) return;

  slider.addEventListener('input', () => {
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, var(--blue-600) 0%, var(--blue-600) ${pct}%, var(--bg-3) ${pct}%)`;
    display.textContent = `₹${parseInt(slider.value).toLocaleString()}`;
  });
})();

/* ── Seat Map ────────────────────────────────────────────────────── */
window.initSeatMap = function() {
  const seats = document.querySelectorAll('.seat-available, .seat-premium');
  let selectedSeat = null;

  seats.forEach(seat => {
    seat.addEventListener('click', () => {
      if (selectedSeat && selectedSeat !== seat) {
        selectedSeat.classList.remove('seat-selected');
      }
      seat.classList.toggle('seat-selected');
      selectedSeat = seat.classList.contains('seat-selected') ? seat : null;

      const seatInfo = document.getElementById('selectedSeatInfo');
      if (seatInfo) {
        seatInfo.textContent = selectedSeat ? `Seat ${seat.dataset.seat} selected` : 'No seat selected';
        seatInfo.style.color = selectedSeat ? 'var(--emerald)' : 'var(--text-4)';
      }
    });
  });
};

/* ── Booking Form Steps ──────────────────────────────────────────── */
window.bookingStep = 1;

window.goToStep = function(step) {
  const current = bookingStep;
  if (step > current) {
    // Validate current step first (basic check)
    const currentForm = document.querySelector(`.step-form[data-step="${current}"]`);
    if (currentForm) {
      const requiredInputs = currentForm.querySelectorAll('[required]');
      let valid = true;
      requiredInputs.forEach(inp => {
        if (!inp.value.trim()) { valid = false; inp.focus(); }
      });
      if (!valid) { showToast('Please fill in all required fields', '⚠️'); return; }
    }
  }

  document.querySelectorAll('.step-form').forEach(f => {
    f.style.display = f.dataset.step == step ? 'block' : 'none';
  });

  document.querySelectorAll('.step').forEach((s, i) => {
    const n = i + 1;
    s.classList.remove('active', 'done');
    if (n < step) s.classList.add('done');
    if (n === step) s.classList.add('active');
  });

  document.querySelectorAll('.step-line').forEach((l, i) => {
    l.classList.remove('active', 'done');
    if (i + 1 < step) l.classList.add('done');
    if (i + 1 === step - 1) l.classList.add('active');
  });

  bookingStep = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* ── Confetti ────────────────────────────────────────────────────── */
window.launchConfetti = function() {
  const colors = ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#F43F5E', '#22D3EE'];
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}vw;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${2 + Math.random() * 2}s;
      animation-delay: ${Math.random() * 0.8}s;
      width: ${6 + Math.random() * 6}px;
      height: ${10 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    document.body.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove());
  }
};

/* ── Scroll to section ───────────────────────────────────────────── */
window.scrollToSection = function(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/* ── Save search params ──────────────────────────────────────────── */
window.saveAndSearch = function() {
  const from = document.getElementById('fromInput')?.value;
  const to   = document.getElementById('toInput')?.value;
  const dep  = document.getElementById('depDate')?.value;
  const ret  = document.getElementById('retDate')?.value;
  const pax  = document.querySelector('[data-pax="adults"] .passenger-val')?.value ?? 1;
  const cls  = document.getElementById('classSelect')?.value ?? 'economy';

  if (!from || !to) {
    showToast('Please enter departure and arrival cities', '⚠️');
    return;
  }
  if (!dep) {
    showToast('Please select a departure date', '📅');
    return;
  }

  sessionStorage.setItem('searchParams', JSON.stringify({ from, to, dep, ret, pax, cls }));
  window.location.href = 'results.html';
};

/* ── Load search params in results ──────────────────────────────── */
window.loadSearchParams = function() {
  const raw = sessionStorage.getItem('searchParams');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};

/* ── Save booking selection ──────────────────────────────────────── */
window.selectFlight = function(flightId) {
  const raw = sessionStorage.getItem('searchParams');
  const params = raw ? JSON.parse(raw) : {};
  params.selectedFlight = flightId;
  sessionStorage.setItem('bookingData', JSON.stringify(params));
  window.location.href = 'booking.html';
};

/* ── Scroll indicator click ──────────────────────────────────────── */
(function() {
  const si = document.querySelector('.scroll-indicator');
  if (si) si.addEventListener('click', () => {
    const next = document.querySelector('.airlines-strip') || document.querySelector('.section');
    if (next) next.scrollIntoView({ behavior: 'smooth' });
  });
})();

/* ── Keyboard shortcuts ──────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
    e.preventDefault();
    document.getElementById('fromInput')?.focus();
  }
});

/* ── Init on DOM ready ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  window.initPassengerCounter?.();
  window.initSeatMap?.();
  window.initAutocomplete?.('fromInput', 'fromDropdown', 'fromCode');
  window.initAutocomplete?.('toInput', 'toDropdown', 'toCode');

  // Restore trip type
  const savedType = sessionStorage.getItem('tripType') || 'round-trip';
  window.setTripType?.(savedType);

  // Restore search params in results page header
  const params = window.loadSearchParams?.();
  if (params) {
    document.querySelectorAll('[data-search-from]').forEach(el => el.textContent = params.from || '');
    document.querySelectorAll('[data-search-to]').forEach(el => el.textContent = params.to || '');
    document.querySelectorAll('[data-search-date]').forEach(el => {
      if (params.dep) {
        const d = new Date(params.dep);
        el.textContent = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      }
    });
    document.querySelectorAll('[data-search-pax]').forEach(el => el.textContent = `${params.pax} Pax`);
    document.querySelectorAll('[data-search-class]').forEach(el => {
      el.textContent = (params.cls || 'economy').replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
    });
  }
});
