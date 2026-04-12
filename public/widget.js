/**
 * Social Proof Widget
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
    enabled_types: ['purchase', 'signup'],
  };

  var events = [];
  var currentIndex = 0;
  var popupEl = null;
  var hideTimer = null;
  var rotateTimer = null;

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
    var who = event.name ? '<strong>' + esc(event.name) + '</strong>' : 'Someone';
    var where = event.city ? ' from <strong>' + esc(event.city) + '</strong>' : '';

    switch (event.type) {
      case 'purchase':
        var what = event.product ? ' just purchased <strong>' + esc(event.product) + '</strong>' : ' just made a purchase';
        return who + where + what;
      case 'signup':
        return who + ' just signed up';
      case 'pageview':
        return who + ' is viewing this page';
      default:
        return who + ' just interacted';
    }
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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
        'max-width:300px;',
        'min-width:240px;',
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;',
        'opacity:0;',
        'transform:translateY(16px);',
        'transition:opacity 0.3s ease,transform 0.3s ease;',
        'pointer-events:none;',
      '}',
      '#sp-popup.sp-visible{',
        'opacity:1;',
        'transform:translateY(0);',
        'pointer-events:auto;',
      '}',
      '#sp-inner{',
        'background:' + (isDark ? '#1f2937' : '#ffffff') + ';',
        'color:' + (isDark ? '#f9fafb' : '#111827') + ';',
        'border:1px solid ' + (isDark ? '#374151' : '#e5e7eb') + ';',
        'border-radius:14px;',
        'padding:12px 14px;',
        'box-shadow:0 4px 24px rgba(0,0,0,' + (isDark ? '0.4' : '0.1') + ');',
        'display:flex;',
        'align-items:center;',
        'gap:10px;',
      '}',
      '#sp-icon{',
        'width:36px;height:36px;',
        'border-radius:50%;',
        'background:linear-gradient(135deg,#6366f1,#8b5cf6);',
        'display:flex;align-items:center;justify-content:center;',
        'font-size:17px;flex-shrink:0;',
      '}',
      '#sp-body{flex:1;min-width:0;}',
      '#sp-msg{',
        'font-size:13px;line-height:1.45;',
        'margin:0;word-break:break-word;',
      '}',
      '#sp-time{',
        'font-size:11px;',
        'color:' + (isDark ? '#9ca3af' : '#6b7280') + ';',
        'margin-top:3px;',
      '}',
      '#sp-close{',
        'background:none;border:none;cursor:pointer;',
        'font-size:15px;line-height:1;',
        'color:' + (isDark ? '#9ca3af' : '#9ca3af') + ';',
        'padding:2px;flex-shrink:0;',
        'opacity:0.6;',
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
      '<div id="sp-inner">',
        '<div id="sp-icon"></div>',
        '<div id="sp-body">',
          '<p id="sp-msg"></p>',
          '<p id="sp-time"></p>',
        '</div>',
        '<button id="sp-close" aria-label="Close">&times;</button>',
      '</div>',
    ].join('');

    el.querySelector('#sp-close').addEventListener('click', hidePopup);
    document.body.appendChild(el);
    return el;
  }

  // ─── Show / Hide ──────────────────────────────────────────────────────────
  function showNext() {
    var filtered = events.filter(function (e) {
      return config.enabled_types.indexOf(e.type) !== -1;
    });
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

  // ─── Boot ─────────────────────────────────────────────────────────────────
  function boot() {
    // 1. Fetch config
    fetchJSON(API_BASE + '/api/config?apiKey=' + encodeURIComponent(API_KEY), function (err, data) {
      if (!err && data && data.config) {
        Object.assign(config, data.config);
      }

      // 2. Fetch events
      fetchJSON(API_BASE + '/api/event?apiKey=' + encodeURIComponent(API_KEY), function (err2, data2) {
        if (err2 || !data2 || !data2.events || !data2.events.length) return;

        events = data2.events;
        injectStyles();

        // 3. Start after delay
        setTimeout(function () {
          showNext();
          rotateTimer = setInterval(showNext, config.rotateInterval * 1000);
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
