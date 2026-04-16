/**
 * Social Proof Widget — Growth Edition
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

  var API_KEY = scriptEl && scriptEl.getAttribute('data-api-key');
  var API_BASE = scriptEl
    ? new URL(scriptEl.src).origin
    : window.location.origin;

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
  };

  // Client-side 60-second cache so rapid page navigations don't re-fetch
  var CACHE_KEY = 'sp_growth_' + API_KEY;
  var CACHE_TTL = 60 * 1000;

  var snapshots = [];   // array of { type, value, message, day_of_week, start_value, end_value }
  var currentIndex = 0;
  var popupEl = null;
  var hideTimer = null;
  var rotateTimer = null;

  // ─── Cache helpers ────────────────────────────────────────────────────────
  function readCache() {
    try {
      var raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (Date.now() > parsed.expiresAt) { sessionStorage.removeItem(CACHE_KEY); return null; }
      return parsed.data;
    } catch (e) { return null; }
  }

  function writeCache(data) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: data, expiresAt: Date.now() + CACHE_TTL }));
    } catch (e) {}
  }

  // ─── Fetch helper ─────────────────────────────────────────────────────────
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

  // ─── Week progress bar SVG ────────────────────────────────────────────────
  function buildProgressBar(dayIndex, accentColor) {
    var bars = '';
    for (var i = 0; i < 7; i++) {
      var color = i < dayIndex ? '#e5e7eb' : i === dayIndex ? accentColor : '#f3f4f6';
      var opacity = i === dayIndex ? '1' : i < dayIndex ? '0.5' : '0.25';
      bars += '<div style="flex:1;height:3px;border-radius:2px;background:' + color + ';opacity:' + opacity + '"></div>';
    }
    return '<div style="display:flex;gap:2px;margin-top:6px;">' + bars + '</div>';
  }

  // ─── Type config ──────────────────────────────────────────────────────────
  var TYPE_META = {
    purchases: { icon: '🔥', color: '#f97316' },
    signups:   { icon: '👋', color: '#3b82f6' },
    visitors:  { icon: '👀', color: '#8b5cf6' },
  };

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ─── Styles ───────────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('sp-styles')) return;
    var isDark = config.theme === 'dark';
    var isRight = config.position === 'bottom-right';

    var css = [
      '#sp-popup{',
        'position:fixed;',
        'bottom:20px;',
        (isRight ? 'right:20px;' : 'left:20px;'),
        'z-index:2147483647;',
        'max-width:310px;min-width:240px;width:calc(100vw - 40px);',
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;',
        'opacity:0;transform:translateY(16px) scale(0.97);',
        'transition:opacity 0.35s cubic-bezier(0.16,1,0.3,1),transform 0.35s cubic-bezier(0.16,1,0.3,1);',
        'pointer-events:none;',
      '}',
      '#sp-popup.sp-visible{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}',
      '#sp-inner{',
        'background:' + (isDark ? '#1a1d2e' : '#ffffff') + ';',
        'color:' + (isDark ? '#f9fafb' : '#111827') + ';',
        'border:1px solid ' + (isDark ? '#2a2d3e' : '#f0f1f3') + ';',
        'border-radius:16px;',
        'padding:14px 16px 14px 14px;',
        'box-shadow:0 4px 32px rgba(0,0,0,' + (isDark ? '0.5' : '0.10') + '),0 1px 6px rgba(0,0,0,0.06);',
        'display:flex;align-items:flex-start;gap:12px;',
      '}',
      '#sp-progress{height:2px;border-radius:2px;background:' + (isDark ? '#2a2d3e' : '#f0f1f3') + ';overflow:hidden;border-radius:16px 16px 0 0;}',
      '#sp-progress-bar{height:100%;background:#4f6ef7;transition:width linear;}',
      '#sp-icon{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;background:' + (isDark ? 'rgba(79,110,247,0.15)' : '#f0f3ff') + ';}',
      '#sp-body{flex:1;min-width:0;}',
      '#sp-count{font-size:22px;font-weight:900;line-height:1;letter-spacing:-0.5px;margin:0;}',
      '#sp-label{font-size:13px;margin-top:2px;line-height:1.4;color:' + (isDark ? '#9ca3af' : '#6b7280') + ';}',
      '#sp-close{',
        'background:none;border:none;cursor:pointer;',
        'font-size:14px;line-height:1;',
        'color:' + (isDark ? '#4b5563' : '#d1d5db') + ';',
        'padding:2px;flex-shrink:0;margin-top:1px;',
        'opacity:0.7;transition:opacity 0.2s;',
      '}',
      '#sp-close:hover{opacity:1;}',
    ].join('');

    var styleEl = document.createElement('style');
    styleEl.id = 'sp-styles';
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
  }

  // ─── DOM ──────────────────────────────────────────────────────────────────
  function createPopup() {
    var el = document.createElement('div');
    el.id = 'sp-popup';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.innerHTML = [
      '<div id="sp-progress"><div id="sp-progress-bar" style="width:100%"></div></div>',
      '<div id="sp-inner">',
        '<div id="sp-icon"></div>',
        '<div id="sp-body">',
          '<p id="sp-count"></p>',
          '<p id="sp-label"></p>',
          '<div id="sp-week"></div>',
        '</div>',
        '<button id="sp-close" aria-label="Close">&times;</button>',
      '</div>',
    ].join('');

    el.querySelector('#sp-close').addEventListener('click', function () {
      hidePopup();
      clearInterval(rotateTimer);
    });
    document.body.appendChild(el);
    return el;
  }

  // ─── Progress bar animation ────────────────────────────────────────────────
  function animateProgress(durationSec) {
    var bar = document.getElementById('sp-progress-bar');
    if (!bar) return;
    bar.style.transition = 'none';
    bar.style.width = '100%';
    // Force reflow
    bar.getBoundingClientRect();
    bar.style.transition = 'width ' + durationSec + 's linear';
    bar.style.width = '0%';
  }

  // ─── Show / Hide ──────────────────────────────────────────────────────────
  function showNext() {
    if (!snapshots.length) return;
    var snap = snapshots[currentIndex % snapshots.length];
    currentIndex++;

    var meta = TYPE_META[snap.type] || { icon: '📊', color: '#4f6ef7' };

    if (!popupEl) popupEl = createPopup();

    document.getElementById('sp-icon').textContent = meta.icon;
    document.getElementById('sp-count').textContent = Number(snap.value).toLocaleString();
    // Strip the count from the message for the label (we show it big above)
    var label = snap.message.replace(/^[\d,]+\s?/, '');
    document.getElementById('sp-label').textContent = label;
    document.getElementById('sp-week').innerHTML = buildProgressBar(snap.day_of_week, meta.color);

    popupEl.classList.add('sp-visible');
    animateProgress(config.displayDuration);

    clearTimeout(hideTimer);
    hideTimer = setTimeout(hidePopup, config.displayDuration * 1000);
  }

  function hidePopup() {
    if (popupEl) popupEl.classList.remove('sp-visible');
  }

  // ─── Boot ─────────────────────────────────────────────────────────────────
  function boot() {
    // Try session cache first (same 60s window as server cache)
    var cached = readCache();
    if (cached && cached.length) {
      snapshots = cached;
      injectStyles();
      setTimeout(function () {
        showNext();
        rotateTimer = setInterval(showNext, config.rotateInterval * 1000);
      }, config.delay * 1000);
      return;
    }

    // Fetch today's growth values from the growth API
    fetchJSON(API_BASE + '/api/growth?apiKey=' + encodeURIComponent(API_KEY), function (err, data) {
      if (err || !data || !data.snapshots || !data.snapshots.length) return;

      // Only show enabled snapshots
      snapshots = data.snapshots.filter(function (s) { return s.enabled; });
      if (!snapshots.length) return;

      writeCache(snapshots);
      injectStyles();

      setTimeout(function () {
        showNext();
        rotateTimer = setInterval(showNext, config.rotateInterval * 1000);
      }, config.delay * 1000);
    });
  }

  // Wait for DOM before booting
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
      
