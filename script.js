/* ==========================================================================
   Roushan Mufti Mohammad: portfolio scripts

   What this file does:
     1. Shows "Download Resume" / "View" certificate links only once the file
        has actually been uploaded, so visitors never hit a broken link
     2. Shows the LinkedIn link and contact form once their placeholders
        (YOUR_...) have been replaced in index.html
     3. Reveals the email address only when "Show email address" is clicked
     4. Sends the contact form without leaving the page
     5. Opens and closes the mobile menu
     6. Fades sections in gently as they scroll into view
   ========================================================================== */

(function () {
  'use strict';

  /* 1. Links to files that may not be uploaded yet
     --------------------------------------------------------------------------
     Any link with the attribute data-requires-file starts hidden. We ask the
     server whether the file exists; if it does, the link is shown. Nothing to
     edit here: upload the PDF with the exact file name used in index.html
     and the button appears on its own. */
  var fileChecks = {}; // remembers each file's answer so it is only checked once

  function fileExists(url) {
    if (!fileChecks[url]) {
      fileChecks[url] = fetch(url, { method: 'HEAD', cache: 'no-cache' })
        .then(function (response) { return response.ok; })
        .catch(function () { return false; });
    }
    return fileChecks[url];
  }

  document.querySelectorAll('[data-requires-file]').forEach(function (link) {
    fileExists(link.getAttribute('href')).then(function (exists) {
      if (exists) {
        link.hidden = false;
      }
    });
  });


  /* 2. LinkedIn link and contact form
     --------------------------------------------------------------------------
     Elements with data-needs-setup stay hidden while their web address still
     contains a placeholder starting with "YOUR_". Replace the placeholder in
     index.html and they appear. */
  document.querySelectorAll('[data-needs-setup]').forEach(function (element) {
    var address = element.getAttribute('href') || element.getAttribute('action') || '';
    if (address.indexOf('YOUR_') === -1) {
      element.hidden = false;
    }
  });


  /* 3. Email address, assembled only on click (keeps it away from spam bots)
     -------------------------------------------------------------------------- */
  var showEmailButton = document.getElementById('show-email');
  var emailSlot = document.getElementById('email-slot');

  if (showEmailButton && emailSlot) {
    showEmailButton.addEventListener('click', function () {
      var user = 'roushan';
      var domain = ['roushanmufti', 'in'].join('.');
      var address = user + '@' + domain;

      var link = document.createElement('a');
      link.href = 'mailto:' + address;
      link.textContent = address;

      emailSlot.replaceChildren(link);
      link.focus();
    });
  }


  /* 4. Contact form (Formspree), sent in the background with a status message
     -------------------------------------------------------------------------- */
  var form = document.querySelector('.contact-form');

  if (form) {
    var status = form.querySelector('.form-status');
    var submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      submitButton.disabled = true;
      status.className = 'form-status';
      status.textContent = 'Sending…';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Form service returned ' + response.status);
          }
          form.reset();
          status.classList.add('is-success');
          status.textContent = 'Thank you. Your message has been sent.';
        })
        .catch(function () {
          status.classList.add('is-error');
          status.textContent = 'Sorry, the message could not be sent. Please try again, or use the email address above.';
        })
        .finally(function () {
          submitButton.disabled = false;
        });
    });
  }


  /* 5. Mobile menu
     -------------------------------------------------------------------------- */
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function setMenu(open) {
    navToggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close the menu after choosing a section
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        setMenu(false);
      }
    });

    // Close the menu with the Escape key
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        navToggle.focus();
      }
    });
  }


  /* 6. Gentle fade-in on scroll
     -------------------------------------------------------------------------- */
  var revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }


  /* Footer year
     -------------------------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();
