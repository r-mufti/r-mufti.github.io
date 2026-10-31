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
     6. Sidebar: turns dark over navy sections (and slides in after the top
        section when the landing animation is not running)
     6b. Landing animation, in the style of heynesh.com: the giant name builds
        up, the top section assembles, and on large screens its pieces fly
        into the sidebar as the visitor scrolls
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
  var morph = { active: false };   // the scroll animation of section 6b, when it runs
  var heroGone = false;            // has the visitor scrolled past the top section?

  // Hidden (and skipped by the Tab key) while the top section fills the screen
  function setSidebar(show) {
    sidebar.classList.toggle('is-shown', show);
    sidebar.inert = !show;
  }

  if (sidebar && hero && hasObserver) {
    setSidebar(false);

    new IntersectionObserver(function (entries) {
      heroGone = !entries[0].isIntersecting;
      if (!morph.active) {
        setSidebar(heroGone);
      }
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


  /* 6b. Landing animation (in the style of heynesh.com)
     --------------------------------------------------------------------------
     a) Opening: the giant name builds letter by letter in the middle of the
        screen, then settles at the top while the photo comes into focus and
        the menu, headline, cards and buttons follow. Any scroll, click, tap
        or key press skips straight to the end.
     b) Large screens: while the visitor scrolls, the top section stays pinned,
        the photo blurs, and the giant name, menu links, key facts and the
        "Contact Me" button fly into the sidebar, which is built piece by piece.
     Both are skipped for visitors who prefer less motion. The timings below are
     fractions of the pinned scroll (0 = top of the page, 1 = morph finished). */
  var root = document.documentElement;
  var stage = hero ? hero.querySelector('.hero-stage') : null;
  var introEndsAt = 0;   // when the opening animation finishes (used by the count-up numbers)

  function clamp01(value) {
    return Math.min(Math.max(value, 0), 1);
  }

  // How far one step has progressed, from 0 to 1, between two points of the scroll
  function part(p, from, to) {
    return clamp01((p - from) / (to - from));
  }

  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // The box around an element's own text (ignores icons and padding)
  function textRect(element) {
    var node = Array.prototype.find.call(element.childNodes, function (child) {
      return child.nodeType === 3 && child.textContent.trim();
    });
    if (!node) {
      return element.getBoundingClientRect();
    }
    var range = document.createRange();
    range.selectNodeContents(node);
    return range.getBoundingClientRect();
  }

  // Splits the headline into lines and letters for the opening animation.
  // Screen readers still get the plain sentence.
  function splitHeading(heading) {
    var lines = [[]];
    heading.childNodes.forEach(function (node) {
      if (node.nodeName === 'BR') {
        lines.push([]);
      } else {
        lines[lines.length - 1].push(node.textContent);
      }
    });
    var label = document.createElement('span');
    label.className = 'visually-hidden';
    label.textContent = heading.textContent.replace(/\s+/g, ' ').trim();
    var visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    var letters = [];
    lines.forEach(function (pieces) {
      var text = pieces.join('').replace(/\s+/g, ' ').trim();
      if (!text) {
        return;
      }
      var line = document.createElement('span');
      line.className = 'hero-line';
      Array.prototype.forEach.call(text, function (character) {
        var letter = document.createElement('span');
        letter.className = 'hero-char';
        letter.textContent = character;
        line.appendChild(letter);
        letters.push(letter);
      });
      visual.appendChild(line);
    });
    heading.replaceChildren(label, visual);
    return letters;
  }

  /* a) Opening animation */
  function playIntro() {
    var animations = [];
    var expo = 'cubic-bezier(0.19, 1, 0.22, 1)';
    var inOut = 'cubic-bezier(0.76, 0, 0.24, 1)';
    var bigScreen = window.matchMedia('(min-width: 1200px)').matches;

    // Each piece starts hidden ("backwards") and the animation removes itself when done
    function run(element, keyframes, options) {
      if (!element || !element.animate) {
        return;
      }
      var settings = { duration: 900, delay: 0, easing: expo, fill: 'backwards' };
      Object.keys(options || {}).forEach(function (key) {
        settings[key] = options[key];
      });
      animations.push(element.animate(keyframes, settings));
    }

    var rise = [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }];
    window.scrollTo(0, 0);

    // 1. The giant name gathers, small, in the middle of the screen...
    var name = stage.querySelector('.masthead');
    var box = name.getBoundingClientRect();
    var shiftY = window.innerHeight / 2 - (box.top + box.height / 2);
    var held = 'translateY(' + shiftY.toFixed(1) + 'px) scale(' + (bigScreen ? 0.42 : 0.72) + ')';
    run(name, [
      { transform: held, transformOrigin: '50% 50%', offset: 0 },
      { transform: held, transformOrigin: '50% 50%', offset: 0.5, easing: inOut },
      { transform: 'none', transformOrigin: '50% 50%', offset: 1 }
    ], { duration: 2000, easing: 'linear' });
    name.querySelectorAll('span').forEach(function (letter, index) {
      run(letter, [{ transform: 'translateY(110%)' }, { transform: 'none' }], { duration: 900, delay: 80 + index * 70 });
    });

    // 2. ...then settles at the top while the photo comes into focus
    run(stage.querySelector('.hero-photo'), [
      { opacity: 0, transform: 'translateY(8%) scale(0.96)', filter: 'blur(16px)' },
      { opacity: 1, transform: 'none', filter: 'blur(0px)' }
    ], { duration: 1400, delay: 1250 });

    // 3. Menu links drop in, headline letters rise, cards pop up, buttons and texts follow
    stage.querySelectorAll('.hero-nav li').forEach(function (item, index) {
      run(item, [{ opacity: 0, transform: 'translateY(-14px)' }, { opacity: 1, transform: 'none' }], { duration: 800, delay: 1650 + index * 55 });
    });
    var heading = stage.querySelector('.hero-heading');
    if (heading) {
      splitHeading(heading).forEach(function (letter, index) {
        run(letter, [{ opacity: 0, transform: 'translateY(110%)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 1500 + index * 22 });
      });
    }
    stage.querySelectorAll('.stat-tile, .trait-card').forEach(function (card, index) {
      run(card, [{ opacity: 0, transform: 'translateY(26px) scale(0.92)' }, { opacity: 1, transform: 'none' }], { duration: 1000, delay: 1800 + index * 120 });
    });
    run(stage.querySelector('.hero-actions'), rise, { delay: 2100 });
    run(stage.querySelector('.hero-intro'), rise, { delay: 2200 });
    run(stage.querySelector('.hero-value'), rise, { delay: 2250 });
    run(document.querySelector('.topbar'), [{ opacity: 0, transform: 'translateY(-16px)' }, { opacity: 1, transform: 'none' }], { delay: 2000 });

    root.classList.remove('intro-pending');
    introEndsAt = performance.now() + 3200;

    // Any scroll, click, tap or key press skips straight to the end
    var events = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
    var stopListening = function () {
      events.forEach(function (type) {
        window.removeEventListener(type, skip);
      });
    };
    var skip = function () {
      animations.forEach(function (animation) {
        animation.finish();
      });
      introEndsAt = 0;
      stopListening();
    };
    events.forEach(function (type) {
      window.addEventListener(type, skip, { passive: true });
    });
    window.setTimeout(stopListening, 3400);
  }

  if (stage && root.classList.contains('intro-pending')) {
    if (reduceMotion || !document.body.animate) {
      root.classList.remove('intro-pending');
    } else {
      playIntro();
    }
  }

  /* b) Scroll animation on large screens: the top section turns into the sidebar */
  var morphScreen = window.matchMedia('(min-width: 1200px)');
  var canMorph = Boolean(stage && sidebar && hasObserver && !reduceMotion &&
    window.CSS && CSS.supports('overflow-x', 'clip'));

  if (canMorph) {
    var name = stage.querySelector('.masthead');
    var photo = stage.querySelector('.hero-photo');
    var heroNav = stage.querySelector('.hero-nav');
    var heroLinks = Array.prototype.slice.call(stage.querySelectorAll('.hero-nav a'));
    var tiles = Array.prototype.slice.call(stage.querySelectorAll('.stat-tile[data-stat]'));
    var ctaButton = stage.querySelector('[data-fly-cta]');
    var otherButtons = Array.prototype.slice.call(stage.querySelectorAll('.hero-actions .btn:not([data-fly-cta])'));
    var heading = stage.querySelector('.hero-heading');
    var traitCard = stage.querySelector('.trait-card');
    var cornerTexts = [stage.querySelector('.hero-intro'), stage.querySelector('.hero-value')];
    var sideLogo = sidebar.querySelector('.side-logo');
    var sideCta = sidebar.querySelector('.side-cta');
    var sideNums = Array.prototype.slice.call(sidebar.querySelectorAll('.side-num'));

    // Sidebar pieces that are built while the visitor scrolls
    var builds = [
      { el: sidebar.querySelector('.side-nav'), from: 0.38, to: 0.48, grow: true },
      { el: sidebar.querySelector('.side-stats'), from: 0.42, to: 0.52, grow: true },
      { el: sidebar.querySelector('.side-marquee'), from: 0.5, to: 0.6 },
      { el: sidebar.querySelector('.side-email'), from: 0.55, to: 0.65, rise: true },
      { el: sidebar.querySelector('.side-brand'), from: 0.6, to: 0.7, grow: true },
      { el: sidebar.querySelector('.side-brand p'), from: 0.78, to: 0.88, rise: true },
      { el: sidebar.querySelector('.side-icon'), from: 0.84, to: 0.9, grow: true }
    ].filter(function (build) { return build.el; });

    var flyers = [];      // pieces of the top section that fly into the sidebar
    var distance = 0;     // how far the visitor scrolls while the section is pinned
    var queued = false;

    // Works out where a piece must move so that `box` (part of it) lands on `target`
    var plan = function (element, elementBox, box, target, scale, alignLeft, from, to, arrival) {
      var tx = alignLeft
        ? target.left - elementBox.left - scale * (box.left - elementBox.left)
        : (target.left + target.width / 2) - elementBox.left - scale * (box.left + box.width / 2 - elementBox.left);
      var ty = (target.top + target.height / 2) - elementBox.top - scale * (box.top + box.height / 2 - elementBox.top);
      flyers.push({ el: element, tx: tx, ty: ty, scale: scale, from: from, to: to, arrival: arrival });
    };

    var measure = function () {
      root.classList.add('is-measuring');
      distance = Math.round(window.innerHeight * 0.95);
      hero.style.height = (stage.offsetHeight + distance) + 'px';

      var base = stage.getBoundingClientRect();
      var local = function (rect) {
        return { left: rect.left - base.left, top: rect.top - base.top, width: rect.width, height: rect.height };
      };
      var shown = function (rect) {
        return rect.width > 0 && rect.height > 0;
      };
      flyers = [];

      // Giant name → the gold "ROUSHAN" label at the top of the sidebar
      var letters = name.querySelectorAll('span');
      var range = document.createRange();
      range.setStart(letters[0].firstChild, 0);
      range.setEnd(letters[letters.length - 1].firstChild, 1);
      var nameBox = local(range.getBoundingClientRect());
      var logoBox = textRect(sideLogo);
      if (shown(logoBox)) {
        plan(name, local(name.getBoundingClientRect()), nameBox, logoBox, logoBox.width / nameBox.width, true, 0, 0.82, sideLogo);
      }

      // Menu links → the matching sidebar links (one after another)
      heroLinks.forEach(function (link, index) {
        var match = sidebar.querySelector('.side-nav a[href="' + link.getAttribute('href') + '"]');
        var target = match ? textRect(match) : null;
        if (target && shown(target)) {
          var own = local(textRect(link));
          var start = 0.02 + index * 0.025;
          plan(link, local(link.getBoundingClientRect()), own, target, target.height / own.height, true, start, start + 0.48, match);
        } else {
          flyers.push({ el: link, fadeOnly: true, from: 0, to: 0.1 });
        }
      });

      // Key-fact cards → the sidebar's numbers
      tiles.forEach(function (tile, index) {
        var match = sidebar.querySelector('.side-stats [data-stat="' + tile.getAttribute('data-stat') + '"]');
        var target = match ? match.getBoundingClientRect() : null;
        var own = local(tile.getBoundingClientRect());
        if (target && shown(target)) {
          var start = index * 0.04;
          plan(tile, own, own, target, Math.min(target.width / own.width, target.height / own.height), false, start, start + 0.56, match);
        } else {
          flyers.push({ el: tile, fadeOnly: true, from: 0.02, to: 0.2 });
        }
      });

      // "Contact Me" → the sidebar's "Contact Me" button
      if (ctaButton) {
        var ctaBox = sideCta.getBoundingClientRect();
        var own = local(ctaButton.getBoundingClientRect());
        if (shown(ctaBox) && shown(own)) {
          plan(ctaButton, own, own, ctaBox, ctaBox.height / own.height, false, 0.08, 0.64, sideCta);
        }
      }

      root.classList.remove('is-measuring');
    };

    // Shows or hides a piece completely once it has faded out (so it can't be clicked or tabbed to)
    var setOpacity = function (element, opacity) {
      element.style.opacity = opacity;
      element.style.visibility = opacity < 0.02 ? 'hidden' : '';
    };

    var gold = [201, 162, 39];
    var navy = [11, 31, 58];

    var apply = function () {
      queued = false;
      if (!morph.active) {
        return;
      }
      var p = distance ? clamp01(-hero.getBoundingClientRect().top / distance) : 0;

      // Pieces flying into the sidebar; each swaps with the real sidebar piece as it lands
      flyers.forEach(function (flyer) {
        if (flyer.fadeOnly) {
          setOpacity(flyer.el, 1 - part(p, flyer.from, flyer.to));
          return;
        }
        var t = easeInOut(part(p, flyer.from, flyer.to));
        var scale = 1 + (flyer.scale - 1) * t;
        flyer.el.style.transform = 'translate(' + (flyer.tx * t).toFixed(1) + 'px, ' + (flyer.ty * t).toFixed(1) + 'px) scale(' + scale.toFixed(4) + ')';
        setOpacity(flyer.el, 1 - part(p, flyer.to - 0.02, flyer.to + 0.01));
        if (flyer.arrival) {
          setOpacity(flyer.arrival, part(p, flyer.to - 0.05, flyer.to));
        }
      });

      // The giant name turns from gold to navy as it shrinks into the sidebar label
      var shade = part(p, 0.6, 0.82);
      name.style.color = 'rgb(' + gold.map(function (value, index) {
        return Math.round(value + (navy[index] - value) * shade);
      }).join(',') + ')';

      // Everything else in the top section blurs, slides or fades away
      var blur = part(p, 0, 0.8);
      photo.style.filter = 'blur(' + (22 * blur).toFixed(1) + 'px)';
      photo.style.opacity = (1 - 0.7 * blur).toFixed(3);

      heroNav.style.setProperty('--sep-opacity', (1 - part(p, 0, 0.08)).toFixed(3));

      var corner = easeInOut(part(p, 0.02, 0.2));
      cornerTexts.forEach(function (element) {
        if (element) {
          element.style.transform = 'translateY(' + (-50 * corner).toFixed(1) + 'px)';
          setOpacity(element, 1 - corner);
        }
      });

      if (traitCard) {
        var away = easeInOut(part(p, 0.05, 0.3));
        var vw = window.innerWidth / 100;
        traitCard.style.transform = 'translate(' + (-25 * vw * away).toFixed(1) + 'px, ' + (-5 * vw * away).toFixed(1) + 'px) scale(' + (1 - 0.7 * away).toFixed(3) + ')';
        setOpacity(traitCard, 1 - away);
      }

      if (heading) {
        var lift = part(p, 0.1, 0.38);
        heading.style.transform = 'translateY(' + (-40 * lift).toFixed(1) + 'px)';
        setOpacity(heading, 1 - lift);
      }
      otherButtons.forEach(function (button) {
        setOpacity(button, 1 - part(p, 0.08, 0.25));
      });

      // The sidebar is built piece by piece
      builds.forEach(function (build) {
        var t = easeInOut(part(p, build.from, build.to));
        if (build.grow) {
          build.el.style.transform = 'scale(' + (0.5 + 0.5 * t).toFixed(3) + ')';
        } else if (build.rise) {
          build.el.style.transform = 'translateY(' + (16 * (1 - t)).toFixed(1) + 'px)';
        }
        setOpacity(build.el, t);
      });

      // The sidebar numbers count up once their box appears
      if (!morph.counted && p >= 0.56) {
        morph.counted = true;
        sideNums.forEach(countUp);
      }

      sidebar.inert = p < 0.9;
    };

    var queueApply = function () {
      if (!queued) {
        queued = true;
        window.requestAnimationFrame(apply);
      }
    };

    // Every element whose style the animation sets, so it can be undone cleanly
    var touched = [name, photo, heroNav, heading, traitCard, ctaButton, sideLogo, sideCta]
      .concat(heroLinks, tiles, otherButtons, cornerTexts, sideNums.map(function (n) { return n.parentElement; }),
        Array.prototype.slice.call(sidebar.querySelectorAll('.side-nav a')),
        builds.map(function (build) { return build.el; }))
      .filter(Boolean);

    var enable = function () {
      morph.active = true;
      root.classList.add('morph-on');
      if (!morph.counted) {
        sideNums.forEach(function (number) { number.textContent = '0'; });
      }
      measure();
      apply();
    };

    var disable = function () {
      morph.active = false;
      root.classList.remove('morph-on');
      hero.style.height = '';
      touched.forEach(function (element) {
        ['transform', 'opacity', 'visibility', 'filter', 'color'].forEach(function (property) {
          element.style.removeProperty(property);
        });
      });
      heroNav.style.removeProperty('--sep-opacity');
      if (!morph.counted) {
        sideNums.forEach(function (number) { number.textContent = number.getAttribute('data-count'); });
      }
      setSidebar(heroGone);
    };

    var refresh = function () {
      if (morphScreen.matches && !morph.active) {
        enable();
      } else if (!morphScreen.matches && morph.active) {
        disable();
      } else if (morph.active) {
        measure();
        apply();
      }
    };

    window.addEventListener('scroll', queueApply, { passive: true });
    window.addEventListener('resize', function () { window.requestAnimationFrame(refresh); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh); // sizes change once the fonts load
    }
    window.addEventListener('load', refresh);
    refresh();

    // A link straight to a section (e.g. roushanmufti.in/#faq): the browser jumped
    // there before the top section grew taller, so jump again to the right place
    if (location.hash.length > 1) {
      var linked = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (linked && morph.active) {
        linked.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    }
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
          // Numbers in the top section wait until the opening animation shows them
          var wait = Math.max(350, introEndsAt - performance.now() - 1200);
          window.setTimeout(function () { countUp(entry.target); }, wait);
          counterObserver.unobserve(entry.target);
        }
      });
    });

    document.querySelectorAll('[data-count]').forEach(function (counter) {
      if (morph.active && counter.classList.contains('side-num')) {
        return; // counted by the landing animation when the sidebar is built
      }
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
