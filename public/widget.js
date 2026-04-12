/**
 * Social Proof Widget (with frontend test events)
 */
(function () {
  'use strict';

  // ─── Config ───────────────────────────────────────────────────────────────
  var scriptEl = document.currentScript ||
    (function () {
      var scripts = document.querySelectorAll('script[src*="widget.js"]');
      return scripts[scripts.length - 1];
    })();

  var API_KEY = scriptEl && scriptEl.getAttribute('data-api-key');
  var API_BASE = scriptEl
    ? new URL(scriptEl.src).origin
    : window.location.origin;

  // ✅ NEW: demo mode toggle
  var DEMO_MODE = scriptEl && scriptEl.getAttribute('data-demo') === 'true';

  if (!API_KEY) {
    console.warn('[SocialProof] Missing data-api-key attribute on script tag.');
    return;
  }

  // ─── State ────────────────────────────────────────────────────────────────
  var config = {
    theme: 'light',
    position: 'bottom-left',
    delay: 5,
    displayDuration: 5,
    rotateInterval: 15,
    enabled_types: ['purchase', 'signup'],
  };

  var events = [];
  var currentIndex = 0;
  var popupEl = null;
  var hideTimer = null;
  var rotateTimer = null;

  // ─── FETCH ────────────────────────────────────────────────────────────────
  function fetchJSON(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        try { cb(null, JSON.parse(xhr.responseText)); }
        catch (e) { cb(e); }
      } else {
        cb(new Error('HTTP ' + xhr.status));
      }
    };
    xhr.onerror = function () { cb(new Error('Network error')); };
    xhr.send();
  }

  // ─── FORMAT ───────────────────────────────────────────────────────────────
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatMessage(event) {
    var who = event.name ? '<strong>' + esc(event.name) + '</strong>' : 'Someone';
    var where = event.city ? ' from <strong>' + esc(event.city) + '</strong>' : '';

    switch (event.type) {
      case 'purchase':
        var what = event.product
          ? ' just purchased <strong>' + esc(event.product) + '</strong>'
          : ' just made a purchase';
        return who + where + what;

      case 'signup':
        return who + ' just signed up';

      default:
        return who + ' just interacted';
    }
  }

  function timeAgo(dateStr) {
    var diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return diff + 's ago';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
  }

  function getIcon(type) {
    var icons = { purchase: '🛒', signup: '👋', pageview: '👀', custom: '⚡' };
    return icons[type] || '⚡';
  }

  // ─── NEW: FRONTEND EVENT EMITTER ─────────────────────────────────────────
  function pushEvent(event) {
    events.unshift(event); // add to front

    // auto show immediately
    currentIndex = 0;
    showNext();
  }

  // expose globally for testing
  window.__sp_emitPurchase = function (data) {
    pushEvent({
      type: 'purchase',
      name: data?.name || 'Test User',
      city: data?.city || 'Dhaka',
      product: data?.product || 'Test Product',
      created_at: new Date().toISOString()
    });
  };

  window.__sp_emitEvent = function (event) {
    pushEvent(Object.assign({
      created_at: new Date().toISOString()
    }, event));
  };

  // ─── AUTO DEMO (every 10s) ───────────────────────────────────────────────
  if (DEMO_MODE) {
    setInterval(function () {
      window.__sp_emitPurchase({
        name: 'Demo User',
        city: 'Narayanganj',
        product: 'Demo Item ' + Math.floor(Math.random() * 100)
      });
    }, 10000);
  }

  // ─── UI (unchanged parts kept minimal) ───────────────────────────────────
  function createPopup() {
    var el = document.createElement('div');
    el.id = 'sp-popup';
    el.innerHTML =
      '<div id="sp-inner">' +
        '<div id="sp-icon"></div>' +
        '<div id="sp-body">' +
          '<p id="sp-msg"></p>' +
          '<p id="sp-time"></p>' +
        '</div>' +
        '<button id="sp-close">&times;</button>' +
      '</div>';

    el.querySelector('#sp-close').onclick = hidePopup;
    document.body.appendChild(el);
    return el;
  }

  function showNext() {
    var filtered = events.filter(e =>
      config.enabled_types.indexOf(e.type) !== -1
    );

    if (!filtered.length) return;

    var event = filtered[currentIndex % filtered.length];
    currentIndex++;

    if (!popupEl) popupEl = createPopup();

    document.getElementById('sp-icon').textContent = getIcon(event.type);
    document.getElementById('sp-msg').innerHTML = formatMessage(event);
    document.getElementById('sp-time').textContent = timeAgo(event.created_at);

    popupEl.classList.add('sp-visible');

    clearTimeout(hideTimer);
    hideTimer = setTimeout(hidePopup, config.displayDuration * 1000);
  }

  function hidePopup() {
    if (popupEl) popupEl.classList.remove('sp-visible');
  }

  // ─── BOOT ─────────────────────────────────────────────────────────────────
  function boot() {
    fetchJSON(API_BASE + '/api/config?apiKey=' + API_KEY, function (_, data) {
      if (data && data.config) Object.assign(config, data.config);

      fetchJSON(API_BASE + '/api/event?apiKey=' + API_KEY, function (_, data2) {
        if (data2 && data2.events) events = data2.events;

        // initial render
        setTimeout(function () {
          showNext();
          rotateTimer = setInterval(showNext, config.rotateInterval * 1000);
        }, config.delay * 1000);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
