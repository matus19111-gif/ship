/**
 * Social Proof Widget — v2
 * Include on any website: <script src="https://yourdomain.com/widget.js" data-api-key="pk_xxx"></script>
 */
(function () {
  'use strict';

  // ─── Config ───────────────────────────────────────────────────────────────
  var scriptEl = document.currentScript ||
    (function () {
      var scripts = document.querySelectorAll('script[src*="widget.js"]');
      return scripts[scripts.length - 1];
    })();

  var API_KEY  = scriptEl && scriptEl.getAttribute('data-api-key');
  var API_BASE = scriptEl
    ? new URL(scriptEl.src).origin
    : window.location.origin;

  if (!API_KEY) {
    console.warn('[SocialProof] Missing data-api-key attribute on script tag.');
    return;
  }

  // ─── State ────────────────────────────────────────────────────────────────
  var config = {
    theme:            'light',
    position:         'bottom-left',
    delay:            5,
    displayDuration:  5,
    rotateInterval:   15,
    enabled_types:    ['purchase', 'signup'],
    // Simulation fields (filled from API if synthetic_enabled)
    synthetic_enabled:  false,
    synthetic_interval: 15,
  };

  var events       = [];
  var currentIndex = 0;
  var popupEl      = null;
  var hideTimer    = null;
  var rotateTimer  = null;

  // Per-session dedup set — never repeat the same event ID twice.
  var shownIds = {};

  // ─── Fetch helpers ────────────────────────────────────────────────────────
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

  // ─── Format message ───────────────────────────────────────────────────────
  function formatMessage(event) {
    var who   = event.name ? '<strong>' + esc(event.name) + '</strong>' : 'Someone';
    var where = event.city ? ' from <strong>' + esc(event.city) + '</strong>' : '';

    switch (event.type) {
      case 'purchase':
        var what = event.product
          ? ' just purchased <strong>' + esc(event.product) + '</strong>'
          : ' just made a purchase';
        return who + where + what;
      case 'signup':
        return who + where + ' just signed up';
      case 'pageview':
        return who + ' is viewing this page';
      default:
        return who + ' just interacted';
    }
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;');
  }

  function timeAgo(dateStr) {
    var diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60)    return diff + 's ago';
    if (diff < 3600)  return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
  }

  function getIcon(type) {
    var icons = { purchase: '🛒', signup: '👋', pageview: '👀', custom: '⚡' };
    return icons[type] || '⚡';
  }

  // ─── Styles ───────────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('sp-styles')) return;

    var isDark  = config.theme === 'dark';
    var isRight = config.position === 'bottom-right';

    var css = [
      '#sp-popup{',
        'position:fixed;',
        'bottom:20px;',
        (isRight ? 'right:20px;' : 'left:20px;'),
        'z-index:2147483647;',
        'max-width:300px;min-width:240px;',
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;',
        'opacity:0;transform:translateY(16px);',
        'transition:opacity 0.3s ease,transform 0.3s ease;',
        'pointer-events:none;',
      '}',
      '#sp-popup.sp-visible{opacity:1;transform:translateY(0);pointer-events:auto;}',
      '#sp-inner{',
        'background:' + (isDark ? '#1f2937' : '#ffffff') + ';',
        'color:'      + (isDark ? '#f9fafb' : '#111827') + ';',
        'border:1px solid ' + (isDark ? '#374151' : '#e5e7eb') + ';',
        'border-radius:14px;',
        'padding:12px 14px;',
        'box-shadow:0 4px 24px rgba(0,0,0,' + (isDark ? '0.4' : '0.1') + ');',
        'display:flex;align-items:center;gap:10px;',
      '}',
      '#sp-icon{',
        'width:36px;height:36px;border-radius:50%;',
        'background:linear-gradient(135deg,#6366f1,#8b5cf6);',
        'display:flex;align-items:center;justify-content:center;',
        'font-size:17px;flex-shrink:0;',
      '}',
      '#sp-body{flex:1;min-width:0;}',
      '#sp-msg{font-size:13px;line-height:1.45;margin:0;word-break:break-word;}',
      '#sp-meta{display:flex;align-items:center;gap:6px;margin-top:3px;}',
      '#sp-time{font-size:11px;color:' + (isDark ? '#9ca3af' : '#6b7280') + ';}',
      '#sp-verified{display:flex;align-items:center;gap:3px;font-size:10px;',
        'color:#10b981;font-weight:600;}',
      // Live visitor bar (shown instead of popup when no events)
      '#sp-live{',
        'position:fixed;bottom:20px;' + (isRight ? 'right:20px;' : 'left:20px;'),
        'z-index:2147483647;',
        'background:' + (isDark ? '#1f2937' : '#ffffff') + ';',
        'color:' + (isDark ? '#f9fafb' : '#111827') + ';',
        'border:1px solid ' + (isDark ? '#374151' : '#e5e7eb') + ';',
        'border-radius:14px;',
        'padding:10px 14px;',
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;',
        'font-size:13px;',
        'box-shadow:0 4px 24px rgba(0,0,0,' + (isDark ? '0.4' : '0.1') + ');',
        'display:flex;align-items:center;gap:8px;',
        'opacity:0;transform:translateY(16px);',
        'transition:opacity 0.3s ease,transform 0.3s ease;',
        'pointer-events:none;',
      '}',
      '#sp-live.sp-visible{opacity:1;transform:translateY(0);}',
      '#sp-close{',
        'background:none;border:none;cursor:pointer;',
        'font-size:15px;line-height:1;',
        'color:#9ca3af;padding:2px;flex-shrink:0;opacity:0.6;',
      '}',
      '#sp-close:hover{opacity:1;}',
    ].join('');

    var styleEl = document.createElement('style');
    styleEl.id = 'sp-styles';
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
  }

  // ─── Verified Checkmark SVG ───────────────────────────────────────────────
  var VERIFIED_SVG = [
    '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">',
      '<circle cx="8" cy="8" r="8" fill="#10b981"/>',
      '<path d="M4.5 8l2.5 2.5 4.5-5" stroke="#fff" stroke-width="1.5"',
        ' stroke-linecap="round" stroke-linejoin="round"/>',
    '</svg>',
  ].join('');

  // ─── DOM ──────────────────────────────────────────────────────────────────
  function createPopup() {
    var el = document.createElement('div');
    el.id = 'sp-popup';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.innerHTML = [
      '<div id="sp-inner">',
        '<div id="sp-icon"></div>',
        '<div id="sp-body">',
          '<p id="sp-msg"></p>',
          '<div id="sp-meta">',
            '<span id="sp-time"></span>',
            '<span id="sp-verified">',
              VERIFIED_SVG,
              '<span>Verified</span>',
            '</span>',
          '</div>',
        '</div>',
        '<button id="sp-close" aria-label="Close">&times;</button>',
      '</div>',
    ].join('');

    el.querySelector('#sp-close').addEventListener('click', hidePopup);
    document.body.appendChild(el);
    return el;
  }

  // ─── Live Visitor Count ───────────────────────────────────────────────────
  // Shown when there are no events to rotate (project is Active but no data).
  var liveEl = null;

  function showLiveVisitors() {
    if (liveEl) return; // already showing
    // Generate a plausible live count: 8–24 viewers.
    var count = 8 + Math.floor(Math.random() * 17);

    liveEl = document.createElement('div');
    liveEl.id = 'sp-live';
    liveEl.innerHTML = '🔥 <strong>' + count + '</strong>&nbsp;people are viewing this page right now';
    document.body.appendChild(liveEl);

    // Animate in on next frame.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { liveEl.classList.add('sp-visible'); });
    });

    // Randomly bump the count every 20–40s to feel organic.
    setInterval(function () {
      count = Math.max(5, count + Math.floor(Math.random() * 7) - 3);
      liveEl.innerHTML = '🔥 <strong>' + count + '</strong>&nbsp;people are viewing this page right now';
    }, 20000 + Math.random() * 20000);
  }

  // ─── Show / Hide ──────────────────────────────────────────────────────────
  function showNext() {
    var filtered = events.filter(function (e) {
      return config.enabled_types.indexOf(e.type) !== -1;
    });

    // ── Always-run: show live visitor count when no events are available ──
    if (!filtered.length) {
      showLiveVisitors();
      return;
    }

    // Pick next event, skip IDs already shown this session (wrap when exhausted).
    var startIndex = currentIndex;
    var event;
    do {
      event = filtered[currentIndex % filtered.length];
      currentIndex++;
      if (!shownIds[event.id]) break;
      // If we've cycled through everything, reset the dedup set and reuse.
      if (currentIndex - startIndex >= filtered.length) {
        shownIds = {};
        break;
      }
    } while (true);

    shownIds[event.id] = true;

    if (!popupEl) popupEl = createPopup();

    document.getElementById('sp-icon').textContent = getIcon(event.type);
    document.getElementById('sp-msg').innerHTML    = formatMessage(event);
    document.getElementById('sp-time').textContent = timeAgo(event.created_at);

    popupEl.classList.add('sp-visible');

    clearTimeout(hideTimer);
    hideTimer = setTimeout(hidePopup, config.displayDuration * 1000);
  }

  function hidePopup() {
    if (popupEl) popupEl.classList.remove('sp-visible');
  }

  // ─── Humanized Interval ───────────────────────────────────────────────────
  // Schedules showNext() with a ±10s random jitter so the popup never appears
  // at the exact same second every cycle ("robotic feeling" fix).
  function scheduleNext() {
    var jitter    = Math.random() * 10 * 1000;               // 0–10 000 ms
    var baseMs    = config.rotateInterval * 1000;
    var intervalMs = baseMs + jitter;

    rotateTimer = setTimeout(function () {
      showNext();
      scheduleNext(); // schedule the next one recursively
    }, intervalMs);
  }

  // ─── Boot ─────────────────────────────────────────────────────────────────
  function boot() {
    // 1. Fetch config
    fetchJSON(API_BASE + '/api/config?apiKey=' + encodeURIComponent(API_KEY), function (err, data) {
      if (!err && data && data.config) {
        Object.assign(config, data.config);
      }

      // 2. Fetch events (may include synthetic events from the Hybrid API)
      fetchJSON(API_BASE + '/api/event?apiKey=' + encodeURIComponent(API_KEY), function (err2, data2) {
        // ── ALWAYS RUN: continue even when no events returned ──────────────
        // (Removed the early-exit guard — project is Active so we always show
        //  *something*, falling back to the live visitor count if needed.)

        if (!err2 && data2 && data2.events) {
          events = data2.events;
        }

        injectStyles();

        // 3. Start after configured delay
        setTimeout(function () {
          showNext();
          scheduleNext();
        }, config.delay * 1000);
      });
    });
  }

  // Wait for DOM before booting
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
