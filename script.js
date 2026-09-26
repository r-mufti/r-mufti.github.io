/* ==========================================================================
   Roushan Mufti Mohammad: portfolio scripts

   What this file does:
     1. Shows "Download Resume" / certificate links only once the file has
        actually been uploaded, so visitors never hit a broken link
     2. Shows the LinkedIn links and contact form once their placeholders
        (YOUR_...) have been replaced in index.html
     3. Email: revealed only on click (contact section) or copied straight to
        the clipboard (sidebar), so spam bots reading the page never see it
     4. Sends the contact form without leaving the page
     5. Opens and closes the phone/tablet menu
     6. Sidebar: slides in after the top section and turns dark over navy sections
     7. Light animation: fade-ins, count-up numbers, the curved journey line,
        skill chips that light up their card, and the sideways credential cards
   ========================================================================== */

(function () {
  'use strict';

  // Visitors can ask their device for less motion; we respect that everywhere below
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasObserver = 'IntersectionObserver' in window;


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


  /* 2. LinkedIn links and contact form
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
  function emailAddress() {
    var user = 'roushan';
    var domain = ['roushanmufti', 'in'].join('.');
    return user + '@' + domain;
  }

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

  // Contact section: "Show email address" turns into the address plus a Copy button
  var showEmailButton = document.getElementById('show-email');
  var emailSlot = document.getElementById('email-slot');

  if (showEmailButton && emailSlot) {
    showEmailButton.addEventListener('click', function () {
      var address = emailAddress();

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

  // Sidebar: one click shows the address and copies it
  document.querySelectorAll('[data-copy-email]').forEach(function (button) {
    var label = button.querySelector('.copy-email-text');
    button.addEventListener('click', function () {
      var address = emailAddress();
      label.textContent = address;
      button.setAttribute('title', address);
      copyText(address).then(function () {
        label.textContent = 'Copied: ' + address;
      }, function () {
        label.textContent = address;
      });
      window.setTimeout(function () {
        label.textContent = address;
      }, 2500);
    });
  });


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


  /* 5. Phone/tablet menu
     -------------------------------------------------------------------------- */
  var navToggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('mobile-nav');

  function setMenu(open) {
    navToggle.setAttribute('aria-expanded', String(open));
    mobileNav.classList.toggle('is-open', open);
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close the menu after choosing a section
    mobileNav.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        setMenu(false);
      }
    });

    // Close the menu with the Escape key
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        setMenu(false);
        navToggle.focus();
      }
    });
  }


  /* 6. Sidebar (large screens)
     -------------------------------------------------------------------------- */
  var sidebar = document.getElementById('sidebar');
  var hero = document.querySelector('.hero');

  if (sidebar && hero && hasObserver) {
    // Hidden (and skipped by the Tab key) while the top section fills the screen
    var setSidebar = function (show) {
      sidebar.classList.toggle('is-shown', show);
      sidebar.inert = !show;
    };
    setSidebar(false);

    new IntersectionObserver(function (entries) {
      setSidebar(!entries[0].isIntersecting);
    }, { rootMargin: '-35% 0px 0px 0px' }).observe(hero);

    // Dark colours while a navy section passes behind the middle of the sidebar
    var darkOnScreen = new Set();
    var themeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          darkOnScreen.add(entry.target);
        } else {
          darkOnScreen.delete(entry.target);
        }
      });
      sidebar.dataset.theme = darkOnScreen.size ? 'dark' : 'light';
    }, { rootMargin: '-50% 0px -50% 0px' });

    document.querySelectorAll('[data-theme="dark"]').forEach(function (section) {
      if (section !== sidebar) {
        themeObserver.observe(section);
      }
    });
  }


  /* 7a. Fade-in on scroll
     --------------------------------------------------------------------------
     Elements with class "reveal" fade up; headings with class "mask" slide up.
     Cards that sit side by side appear one after another. */
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

  if (!reduceMotion && hasObserver) {
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


  /* 7b. Key-fact numbers count up from zero when they come into view
     -------------------------------------------------------------------------- */
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

  if (!reduceMotion && hasObserver) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          window.setTimeout(function () { countUp(entry.target); }, 350);
          counterObserver.unobserve(entry.target);
        }
      });
    });

    document.querySelectorAll('[data-count]').forEach(function (counter) {
      counter.textContent = '0';
      counterObserver.observe(counter);
    });
  }


  /* 7c. Journey: a curved line joins the cards and fills in as you scroll
     --------------------------------------------------------------------------
     On wider screens the line is drawn in an SVG, curving from card to card.
     On phones a straight line is drawn by styles.css instead. */
  var journey = document.getElementById('journey');

  if (journey) {
    var svg = journey.querySelector('.journey-path');
    var trackPath = journey.querySelector('.journey-track');
    var fillPath = journey.querySelector('.journey-fill');
    var dotGroup = journey.querySelector('.journey-dots');
    var items = Array.prototype.slice.call(journey.querySelectorAll('.journey-item'));
    var wideScreen = window.matchMedia('(min-width: 760px)');
    var pathLength = 0;
    var dotLengths = [];
    var journeyQueued = false;

    // Works out where each card's dot goes and draws the curve through them
    var drawPath = function () {
      dotGroup.replaceChildren();
      dotLengths = [];
      if (!wideScreen.matches) {
        return;
      }
      var box = journey.getBoundingClientRect();
      svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);

      var points = items.map(function (item, index) {
        var card = item.querySelector('.journey-card').getBoundingClientRect();
        var onLeft = index % 2 === 0;
        return {
          x: (onLeft ? card.right : card.left) - box.left,
          y: card.top - box.top + 64
        };
      });

      // Smooth S-shaped curves between neighbouring dots
      var d = 'M ' + points[0].x + ' ' + (points[0].y - 70) + ' L ' + points[0].x + ' ' + points[0].y;
      var measure = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      svg.appendChild(measure);
      measure.setAttribute('d', d);
      dotLengths.push(measure.getTotalLength());

      for (var i = 1; i < points.length; i++) {
        var from = points[i - 1];
        var to = points[i];
        var midX = (from.x + to.x) / 2;
        d += ' C ' + midX + ' ' + from.y + ' ' + midX + ' ' + to.y + ' ' + to.x + ' ' + to.y;
        measure.setAttribute('d', d);
        dotLengths.push(measure.getTotalLength());
      }
      var last = points[points.length - 1];
      d += ' L ' + last.x + ' ' + (last.y + 90);
      svg.removeChild(measure);

      trackPath.setAttribute('d', d);
      fillPath.setAttribute('d', d);
      pathLength = fillPath.getTotalLength();
      fillPath.style.strokeDasharray = pathLength;

      points.forEach(function (point) {
        var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', point.x);
        dot.setAttribute('cy', point.y);
        dot.setAttribute('r', 7);
        dotGroup.appendChild(dot);
      });
    };

    // Moves the gold/navy fill to match how far the visitor has scrolled
    var updateJourney = function () {
      journeyQueued = false;
      var box = journey.getBoundingClientRect();
      var progress = 1;
      if (!reduceMotion) {
        progress = (window.innerHeight * 0.65 - box.top) / box.height;
        progress = Math.min(Math.max(progress, 0), 1);
      }

      if (wideScreen.matches && pathLength) {
        var filled = pathLength * progress;
        fillPath.style.strokeDashoffset = pathLength - filled;
        Array.prototype.forEach.call(dotGroup.children, function (dot, index) {
          dot.classList.toggle('is-passed', dotLengths[index] <= filled + 1);
        });
      } else {
        journey.style.setProperty('--progress', progress.toFixed(3));
        var lineEnd = box.top + progress * box.height;
        items.forEach(function (item) {
          item.classList.toggle('is-passed', item.getBoundingClientRect().top + 40 <= lineEnd);
        });
      }
    };

    var queueJourneyUpdate = function () {
      if (!journeyQueued) {
        journeyQueued = true;
        window.requestAnimationFrame(updateJourney);
      }
    };

    var redraw = function () {
      drawPath();
      updateJourney();
    };

    window.addEventListener('scroll', queueJourneyUpdate, { passive: true });
    window.addEventListener('resize', function () { window.requestAnimationFrame(redraw); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(redraw); // card sizes change once the fonts load
    }
    window.addEventListener('load', redraw);
    redraw();
  }


  /* 7d. Skill chips light up the card they point to
     -------------------------------------------------------------------------- */
  document.querySelectorAll('[data-lights]').forEach(function (chip) {
    var card = document.getElementById(chip.getAttribute('data-lights'));
    if (!card) {
      return;
    }
    var on = function () { card.classList.add('is-lit'); };
    var off = function () { card.classList.remove('is-lit'); };
    chip.addEventListener('mouseenter', on);
    chip.addEventListener('mouseleave', off);
    chip.addEventListener('focus', on);
    chip.addEventListener('blur', off);
  });


  /* 7e. Credential cards: previous / next buttons scroll the row sideways
     -------------------------------------------------------------------------- */
  var credTrack = document.querySelector('#certifications .cred-track');

  document.querySelectorAll('[data-cred-scroll]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (!credTrack) {
        return;
      }
      var card = credTrack.querySelector('.cred-card');
      var step = card ? card.getBoundingClientRect().width + 20 : 320;
      credTrack.scrollBy({ left: step * parseInt(button.getAttribute('data-cred-scroll'), 10), behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });


  /* 7f. Highlight the menu links for the section on screen
     -------------------------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.side-nav a, .mobile-nav a, .hero-nav a'));
  var sectionIds = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);
    if (sectionIds.indexOf(id) === -1) {
      sectionIds.push(id);
    }
  });
  var onScreen = {};

  if (navLinks.length && hasObserver) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        onScreen[entry.target.id] = entry.isIntersecting;
      });

      // If two qualify (e.g. About and the journey inside it), the later one wins
      var current = null;
      sectionIds.forEach(function (id) {
        if (onScreen[id]) {
          current = id;
        }
      });

      navLinks.forEach(function (link) {
        if (current && link.getAttribute('href') === '#' + current) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sectionIds.forEach(function (id) {
      var target = document.getElementById(id);
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
