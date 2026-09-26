/* ==========================================================================
   Roushan Mufti Mohammad: portfolio scripts

   What this file does:
     1. Shows "Download Resume" / "View" certificate links only once the file
        has actually been uploaded, so visitors never hit a broken link
     2. Shows the LinkedIn link and contact form once their placeholders
        (YOUR_...) have been replaced in index.html
     3. Reveals the email address only when "Show email address" is clicked,
        with a "Copy" button next to it
     4. Sends the contact form without leaving the page
     5. Opens and closes the mobile menu
     6. Light animation: cards fade in, numbers count up, the education
        timeline fills in, and the menu highlights the section on screen
   ========================================================================== */

(function () {
  'use strict';

  // Visitors can ask their device for less motion; we respect that everywhere below
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


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

  // Copies text to the clipboard (with a fallback for older browsers)
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var field = document.createElement('textarea');
      field.value = text;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      var copied = false;
      try {
        copied = document.execCommand('copy');
      } catch (error) {
        copied = false;
      }
      document.body.removeChild(field);
      if (copied) {
        resolve();
      } else {
        reject();
      }
    });
  }

  if (showEmailButton && emailSlot) {
    showEmailButton.addEventListener('click', function () {
      var user = 'roushan';
      var domain = ['roushanmufti', 'in'].join('.');
      var address = user + '@' + domain;

      var link = document.createElement('a');
      link.href = 'mailto:' + address;
      link.textContent = address;

      var copyButton = document.createElement('button');
      copyButton.type = 'button';
      copyButton.className = 'copy-button';
      copyButton.textContent = 'Copy';
      copyButton.addEventListener('click', function () {
        copyText(address).then(function () {
          copyButton.textContent = 'Copied';
        }, function () {
          copyButton.textContent = 'Copy failed';
        });
        window.setTimeout(function () {
          copyButton.textContent = 'Copy';
        }, 2500);
      });

      emailSlot.replaceChildren(link, copyButton);
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


  /* 6a. Fade-in on scroll
     --------------------------------------------------------------------------
     Elements with class "reveal" fade up; headings with class "mask" slide up.
     Cards in the same row appear one after another. */
  var animated = document.querySelectorAll('.reveal, .mask');

  function showElement(element) {
    element.classList.add('is-visible');
    if (element.classList.contains('reveal')) {
      // Once the fade has finished, drop the animation classes so hover effects stay snappy
      window.setTimeout(function () {
        element.classList.remove('reveal', 'is-visible');
        element.style.transitionDelay = '';
      }, 1300);
    }
  }

  if (!reduceMotion && 'IntersectionObserver' in window) {
    // Stagger cards that sit side by side
    animated.forEach(function (element) {
      if (!element.classList.contains('reveal') || !element.parentElement) {
        return;
      }
      var siblings = Array.prototype.filter.call(element.parentElement.children, function (child) {
        return child.classList.contains('reveal');
      });
      var index = siblings.indexOf(element);
      if (index > 0) {
        element.style.transitionDelay = Math.min(index, 5) * 70 + 'ms';
      }
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          showElement(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

    animated.forEach(function (element) { revealObserver.observe(element); });
  } else {
    animated.forEach(function (element) { element.classList.add('is-visible'); });
  }


  /* 6b. Key-fact numbers count up from zero when they come into view
     -------------------------------------------------------------------------- */
  var counters = document.querySelectorAll('[data-count]');

  function countUp(element) {
    var target = parseInt(element.getAttribute('data-count'), 10);
    var duration = 1100;
    var start = null;

    function step(timestamp) {
      if (start === null) {
        start = timestamp;
      }
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }
    window.requestAnimationFrame(step);
  }

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Short pause so the count starts once the card has faded in
          window.setTimeout(function () { countUp(entry.target); }, 250);
          counterObserver.unobserve(entry.target);
        }
      });
    });

    counters.forEach(function (counter) {
      counter.textContent = '0';
      counterObserver.observe(counter);
    });
  }


  /* 6c. Education timeline: the gold line fills in as the visitor scrolls
     -------------------------------------------------------------------------- */
  var journey = document.querySelector('.journey');

  if (journey) {
    var journeyItems = journey.querySelectorAll('.journey-item');
    var journeyQueued = false;

    var updateJourney = function () {
      journeyQueued = false;
      var box = journey.getBoundingClientRect();
      var progress = 1;
      if (!reduceMotion) {
        progress = (window.innerHeight * 0.6 - box.top) / box.height;
        progress = Math.min(Math.max(progress, 0), 1);
      }
      journey.style.setProperty('--progress', progress.toFixed(3));

      // Light up each marker once the line has reached it
      var lineEnd = box.top + progress * box.height;
      journeyItems.forEach(function (item) {
        var marker = item.getBoundingClientRect().top + 30;
        item.classList.toggle('is-passed', marker <= lineEnd + 1);
      });
    };

    var queueJourneyUpdate = function () {
      if (!journeyQueued) {
        journeyQueued = true;
        window.requestAnimationFrame(updateJourney);
      }
    };

    window.addEventListener('scroll', queueJourneyUpdate, { passive: true });
    window.addEventListener('resize', queueJourneyUpdate);
    updateJourney();
  }


  /* 6d. Highlight the menu link for the section on screen
     -------------------------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
  var onScreen = {};

  if (navLinks.length && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        onScreen[entry.target.id] = entry.isIntersecting;
      });

      // If two sections qualify (e.g. About and the Education list inside it),
      // the later one in the menu wins
      var current = null;
      navLinks.forEach(function (link) {
        if (onScreen[link.getAttribute('href').slice(1)]) {
          current = link;
        }
      });

      navLinks.forEach(function (link) {
        if (link === current) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    navLinks.forEach(function (link) {
      var target = document.getElementById(link.getAttribute('href').slice(1));
      if (target) {
        sectionObserver.observe(target);
      }
    });
  }


  /* Footer year
     -------------------------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();
