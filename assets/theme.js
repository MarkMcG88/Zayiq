/**
 * Zayiq Theme JavaScript
 * Bold Artist-Collaboration Apparel
 */

(function() {
  'use strict';

  /* --- Scroll Reveal --- */
  var revealElements = document.querySelectorAll('.reveal, .reveal-stagger, .reveal-fade, .hero');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function(el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function(el) {
      el.classList.add('is-visible');
    });
  }

  /* --- Header Scroll State --- */
  var header = document.querySelector('.header');
  var lastScroll = 0;

  if (header) {
    window.addEventListener('scroll', function() {
      var scrollY = window.scrollY;

      if (scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }

      lastScroll = scrollY;
    }, { passive: true });
  }

  /* --- Mobile Menu --- */
  var menuToggle = document.querySelector('.header__menu-toggle');
  var headerNav = document.querySelector('.header__nav');

  if (menuToggle && headerNav) {
    menuToggle.addEventListener('click', function() {
      headerNav.classList.toggle('is-open');
      var isOpen = headerNav.classList.contains('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen);

      // Toggle body scroll
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && headerNav.classList.contains('is-open')) {
        headerNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* --- Product Page: Variant Selector --- */
  var variantOptions = document.querySelectorAll('.product-page__variant-option');
  variantOptions.forEach(function(option) {
    option.addEventListener('click', function() {
      var group = this.closest('.product-page__variant-options');
      group.querySelectorAll('.product-page__variant-option').forEach(function(o) {
        o.classList.remove('is-active');
      });
      this.classList.add('is-active');

      var value = this.dataset.value;
      var variantSelect = document.querySelector('select[name="id"]');
      if (variantSelect && value) {
        for (var i = 0; i < variantSelect.options.length; i++) {
          if (variantSelect.options[i].text.includes(value)) {
            variantSelect.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  /* --- Product Page: Image Gallery --- */
  var thumbs = document.querySelectorAll('.product-page__thumb');
  var mainImage = document.querySelector('.product-page__main-image img');

  thumbs.forEach(function(thumb) {
    thumb.addEventListener('click', function() {
      thumbs.forEach(function(t) { t.classList.remove('is-active'); });
      this.classList.add('is-active');

      if (mainImage) {
        mainImage.style.opacity = '0';
        mainImage.style.transition = 'opacity 0.2s ease';

        setTimeout(function() {
          mainImage.src = thumb.dataset.src;
          mainImage.srcset = thumb.dataset.srcset || '';
          mainImage.style.opacity = '1';
        }, 200);
      }
    });
  });

  /* --- Cart Quantity --- */
  document.querySelectorAll('.cart-item__quantity').forEach(function(wrapper) {
    var minus = wrapper.querySelector('[data-action="decrease"]');
    var plus = wrapper.querySelector('[data-action="increase"]');
    var input = wrapper.querySelector('input');

    if (minus && plus && input) {
      minus.addEventListener('click', function() {
        var val = parseInt(input.value) - 1;
        if (val >= 0) {
          input.value = val;
          input.dispatchEvent(new Event('change'));
        }
      });

      plus.addEventListener('click', function() {
        var val = parseInt(input.value) + 1;
        input.value = val;
        input.dispatchEvent(new Event('change'));
      });
    }
  });

  /* --- Marquee: duplicate content for seamless loop --- */
  document.querySelectorAll('.announcement-bar__track, .brand-ticker__track').forEach(function(track) {
    var clone = track.innerHTML;
    track.innerHTML = clone + clone;
  });

})();
