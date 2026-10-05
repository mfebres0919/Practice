/* ==========================================================================
   The Fairy Fund — global.js
   Site-wide behavior. Vanilla JS, no dependencies.

   Currently: mobile navigation panel (open/close, focus handling, Escape,
   backdrop click, scroll lock, reset when resizing up to desktop).
   ========================================================================== */

(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  var overlay = document.querySelector('.nav-overlay');
  var closeButton = document.querySelector('.nav-close');

  if (!header || !toggle || !nav) {
    return;
  }

  var OPEN_CLASS = 'nav-is-open';
  var BODY_CLASS = 'has-open-nav';
  var FOCUSABLE = 'a[href], button:not([disabled])';
  /* Must match the navigation row breakpoint in css/global.css */
  var desktopQuery = window.matchMedia('(min-width: 68em)');

  function isOpen() {
    return header.classList.contains(OPEN_CLASS);
  }

  function openNav() {
    header.classList.add(OPEN_CLASS);
    document.body.classList.add(BODY_CLASS);
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');

    var first = nav.querySelector(FOCUSABLE);
    if (first) {
      first.focus();
    }
  }

  function closeNav(returnFocus) {
    header.classList.remove(OPEN_CLASS);
    document.body.classList.remove(BODY_CLASS);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');

    if (returnFocus) {
      toggle.focus();
    }
  }

  /* Keep Tab inside the panel while it is open */
  function trapFocus(event) {
    var items = Array.prototype.filter.call(
      nav.querySelectorAll(FOCUSABLE),
      function (item) {
        return item.offsetParent !== null;
      }
    );

    if (!items.length) {
      return;
    }

    var first = items[0];
    var last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  toggle.addEventListener('click', function () {
    if (isOpen()) {
      closeNav(false);
    } else {
      openNav();
    }
  });

  if (closeButton) {
    closeButton.addEventListener('click', function () {
      closeNav(true);
    });
  }

  if (overlay) {
    overlay.addEventListener('click', function () {
      closeNav(true);
    });
  }

  /* Close after choosing a destination, so returning via the back button
     never lands on an open panel */
  nav.addEventListener('click', function (event) {
    if (event.target.closest('a') && !desktopQuery.matches) {
      closeNav(false);
    }
  });

  document.addEventListener('keydown', function (event) {
    if (!isOpen()) {
      return;
    }

    if (event.key === 'Escape') {
      closeNav(true);
    } else if (event.key === 'Tab') {
      trapFocus(event);
    }
  });

  /* Resizing past the desktop breakpoint turns the panel into a row —
     drop the open state so scroll lock and focus trap do not linger */
  function handleBreakpoint(event) {
    if (event.matches && isOpen()) {
      closeNav(false);
    }
  }

  if (typeof desktopQuery.addEventListener === 'function') {
    desktopQuery.addEventListener('change', handleBreakpoint);
  } else if (typeof desktopQuery.addListener === 'function') {
    desktopQuery.addListener(handleBreakpoint);
  }
})();


/* ==========================================================================
   Contact form
   Checks the required fields, shows inline errors, and confirms the send.
   There is no backend yet — once the form's action points at a real
   endpoint, replace the confirmation branch with a fetch() to it.
   ========================================================================== */

(function () {
  'use strict';

  var forms = document.querySelectorAll('[data-contact-form]');

  Array.prototype.forEach.call(forms, function (form) {
    var status = form.querySelector('.contact-form__status');
    var fields = form.querySelectorAll('[required]');

    function check(field) {
      var wrapper = field.closest('.form-field');
      var error = wrapper && wrapper.querySelector('.form-field__error');
      var valid = field.checkValidity() && field.value.trim() !== '';

      if (wrapper) {
        wrapper.classList.toggle('is-invalid', !valid);
      }

      field.setAttribute('aria-invalid', valid ? 'false' : 'true');

      if (error) {
        if (valid) {
          field.removeAttribute('aria-describedby');
        } else {
          field.setAttribute('aria-describedby', error.id);
        }
      }

      return valid;
    }

    /* Once a field has been flagged, clear the error as soon as it's fixed */
    Array.prototype.forEach.call(fields, function (field) {
      var eventName = field.tagName === 'SELECT' ? 'change' : 'input';

      field.addEventListener(eventName, function () {
        if (field.getAttribute('aria-invalid') === 'true') {
          check(field);
        }
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var firstInvalid = null;

      Array.prototype.forEach.call(fields, function (field) {
        if (!check(field) && !firstInvalid) {
          firstInvalid = field;
        }
      });

      if (firstInvalid) {
        status.classList.remove('is-success');
        status.textContent = '';
        firstInvalid.focus();
        return;
      }

      var name = form.querySelector('[name="name"]').value.trim().split(' ')[0];

      status.textContent =
        'Thanks, ' + name + '! Your message is on its way — we’ll get back to you soon.';
      status.classList.add('is-success');

      /* Keep the chosen topic so a second question on the same service
         doesn't need re-selecting */
      var topic = form.querySelector('[name="topic"]');
      var keep = topic ? topic.value : '';
      form.reset();
      if (topic) {
        topic.value = keep;
      }
    });
  });
})();
