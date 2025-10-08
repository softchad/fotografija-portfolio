(function () {
  'use strict';

  var qs  = function (sel, root) { return (root || document).querySelector(sel); };
  var qsa = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var on  = function (el, ev, fn) { el.addEventListener(ev, fn, false); };

  var MODAL_ID = 'photoModal';
  var SELECTOR_OPEN = 'img.open-photo';
  var SELECTOR_CARD = '.galerija-item, .portfolio-item';
  var LS_KEY = function (src) { return 'likes:' + src; };

  function ensureModal() {
    var existing = qs('#' + MODAL_ID);
    if (existing) return existing;

    var wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.id = MODAL_ID;
    wrap.innerHTML =
      '<div class="modal">' +
        '<div class="modal-bar">' +
          '<div class="modal-title" id="modalTitle"></div>' +
          '<div class="modal-actions">' +
            '<button class="like-btn" id="likeBtn">❤ <span class="like-count" id="likeCount">0</span></button>' +
            '<button class="modal-close" id="modalClose" aria-label="Uždaryti">✕</button>' +
          '</div>' +
        '</div>' +
        '<img id="modalImg" src="" alt="">' +
      '</div>';
    document.body.appendChild(wrap);
    return wrap;
  }

  function getNumber(val, fallback) {
    var n = parseInt(val, 10);
    return isNaN(n) ? (fallback || 0) : n;
  }

  function getCard(el) {
    return el.closest(SELECTOR_CARD);
  }

function updateCardBadgeBySrc(src, value) {
  var img = qsa('img').find(function (i) { return i.getAttribute('src') === src; });
  if (!img) return;
  var card = getCard(img);
  if (!card) return;

  var badge = qs('.hearts-badge', card);
  if (badge) badge.textContent = String(value);

  var likeBadge = qs('.like-badge', card);
  if (likeBadge) likeBadge.textContent = String(value);
}


function initHeartsBadges() {
  qsa(SELECTOR_OPEN).forEach(function (img) {
    var src = img.getAttribute('src');
    if (!src) return;

    var initial = getNumber(img.dataset.likes, 0);
    var stored = localStorage.getItem(LS_KEY(src));
    var value = (stored === null) ? initial : getNumber(stored, initial);

    localStorage.setItem(LS_KEY(src), String(value));

    var card = getCard(img);
    if (!card) return;

    var hb = qs('.hearts-badge', card);
    if (hb) hb.textContent = String(value);

    var lb = qs('.like-badge', card);
    if (lb) lb.textContent = String(value);
  });
}


  function openModalFromImage(img) {
    var modal = ensureModal();
    var imgEl   = qs('#modalImg', modal);
    var titleEl = qs('#modalTitle', modal);
    var likeCnt = qs('#likeCount', modal);

    var src = img.getAttribute('src') || '';
    var title = img.dataset.title || img.getAttribute('alt') || '';
    var likes = getNumber(localStorage.getItem(LS_KEY(src)), getNumber(img.dataset.likes, 0));

    imgEl.src = src;
    imgEl.alt = title;
    titleEl.textContent = title;
    likeCnt.textContent = String(likes);
    modal.dataset.originSrc = src;

    img.classList.add('focused');
    modal.classList.add('show');
  }

  function closeModal() {
    var modal = qs('#' + MODAL_ID);
    if (!modal) return;
    modal.classList.remove('show');
    var imgEl = qs('#modalImg', modal);
    if (imgEl) imgEl.src = '';
    modal.dataset.originSrc = '';
    qsa(SELECTOR_OPEN + '.focused').forEach(function (el) { el.classList.remove('focused'); });
  }

  function likeOnce() {
    var modal = qs('#' + MODAL_ID);
    if (!modal) return;
    var src = modal.dataset.originSrc;
    if (!src) return;

    var key = LS_KEY(src);
    var curr = getNumber(localStorage.getItem(key), 0) + 1;
    localStorage.setItem(key, String(curr));

    var likeCnt = qs('#likeCount', modal);
    if (likeCnt) likeCnt.textContent = String(curr);

    updateCardBadgeBySrc(src, curr);
  }

function delegateClicks(e) {
  var target = e.target;

  if (target.id === 'modalClose' || (target.closest && target.closest('#modalClose'))) {
    e.preventDefault(); closeModal(); return;
  }

  var modal = qs('#' + MODAL_ID);
  if (modal && target === modal) { closeModal(); return; }

  // nauja dalis: leisk spausti ant kortelės elementų (badge, overlay ir pan.)
  var img = target.closest ? target.closest(SELECTOR_OPEN) : null;
  if (!img) {
    var card = target.closest && target.closest(SELECTOR_CARD);
    if (card) img = qs(SELECTOR_OPEN, card);
  }
  if (img) { e.preventDefault(); openModalFromImage(img); return; }

  if (target.id === 'likeBtn' || (target.closest && target.closest('#likeBtn'))) {
    e.preventDefault(); likeOnce(); return;
  }
}


  function keyHandler(e) {
    if (e.key === 'Escape') closeModal();
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    ensureModal();
    initHeartsBadges();
    on(document, 'click', delegateClicks);
    on(window, 'keydown', keyHandler);
  });

})();


