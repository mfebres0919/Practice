/* ==========================================================================
   The Fairy Fund — script.js
   Homepage-only behavior.

   Currently: refund advance popup, shown once per browser session.
   ========================================================================== */

(function () {
  'use strict';

  var promo = document.querySelector('.promo');

  if (!promo || typeof promo.showModal !== 'function') {
    return;
  }

  var SEEN_KEY = 'fairyFundPromoSeen';
  var DELAY_MS = 1500;

  /* Storage can throw in private windows — treat that as "not seen" */
  function hasSeen() {
    try {
      return sessionStorage.getItem(SEEN_KEY) === '1';
    } catch (error) {
      return false;
    }
  }

  function markSeen() {
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch (error) {
      /* Nothing to do: the popup simply shows again next load */
    }
  }

  function openPromo() {
    promo.showModal();
    /* Focus the dialog itself rather than letting the browser pick the close
       button, which would show a focus ring before any interaction */
    promo.focus();
    markSeen();

    /* Next frame, so the fade-in transition has a starting state */
    window.requestAnimationFrame(function () {
      promo.classList.add('is-visible');
    });
  }

  function closePromo() {
    promo.classList.remove('is-visible');
    promo.close();
  }

  promo.addEventListener('click', function (event) {
    /* A click on the dialog element itself lands on the backdrop */
    if (event.target === promo || event.target.closest('[data-promo-close]')) {
      closePromo();
    }
  });

  /* Escape closes natively; keep the class in sync so it can reopen cleanly */
  promo.addEventListener('close', function () {
    promo.classList.remove('is-visible');
  });

  if (!hasSeen()) {
    window.setTimeout(openPromo, DELAY_MS);
  }
})();
