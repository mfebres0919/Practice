/* ==========================================================================
   The Fairy Fund — service-detail.js
   Shared by the service detail pages in /html.

   Currently: FAQ accordion. The native <details> element does the opening
   and closing; this only animates the answer's height both ways, which
   browsers can't yet do on their own everywhere.
   ========================================================================== */

(function () {
  'use strict';

  var items = document.querySelectorAll('.faq__item');

  if (!items.length || typeof Element.prototype.animate !== 'function') {
    return;
  }

  var DURATION = 380;
  var EASING = 'cubic-bezier(0.22, 0.61, 0.36, 1)';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  Array.prototype.forEach.call(items, function (item) {
    var summary = item.querySelector('.faq__question');
    var answer = item.querySelector('.faq__answer');
    var animation = null;

    if (!summary || !answer) {
      return;
    }

    function finish(isOpen) {
      item.open = isOpen;
      item.classList.remove('is-closing');
      animation = null;
    }

    function run(from, to, isOpen) {
      /* A click mid-animation reverses from wherever the answer is now */
      if (animation) {
        animation.cancel();
      }

      animation = answer.animate(
        [
          { height: from + 'px', opacity: isOpen ? 0 : 1 },
          { height: to + 'px', opacity: isOpen ? 1 : 0 }
        ],
        { duration: DURATION, easing: EASING }
      );

      animation.onfinish = function () {
        finish(isOpen);
      };
    }

    summary.addEventListener('click', function (event) {
      if (reducedMotion.matches) {
        return;
      }

      event.preventDefault();

      /* Mid-way when a running animation gets reversed. A shut item is read
         as 0 — Chrome keeps reporting the hidden answer's last height. */
      var current = item.open ? answer.getBoundingClientRect().height : 0;

      if (!item.open || item.classList.contains('is-closing')) {
        /* Open first so the full height can be measured */
        item.classList.remove('is-closing');
        item.open = true;
        run(current, answer.scrollHeight, true);
      } else {
        item.classList.add('is-closing');
        run(current, 0, false);
      }
    });
  });
})();
