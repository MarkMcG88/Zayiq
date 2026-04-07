/**
 * Zayiq Theme JavaScript
 */

(function() {
  'use strict';

  /* --- Mobile Menu --- */
  const menuToggle = document.querySelector('.header__menu-toggle');
  const headerNav = document.querySelector('.header__nav');

  if (menuToggle && headerNav) {
    menuToggle.addEventListener('click', function() {
      headerNav.classList.toggle('is-open');
      const isOpen = headerNav.classList.contains('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  /* --- Product Page: Variant Selector --- */
  const variantOptions = document.querySelectorAll('.product-page__variant-option');
  variantOptions.forEach(function(option) {
    option.addEventListener('click', function() {
      const group = this.closest('.product-page__variant-options');
      group.querySelectorAll('.product-page__variant-option').forEach(function(o) {
        o.classList.remove('is-active');
      });
      this.classList.add('is-active');

      // Update hidden variant selector if present
      const value = this.dataset.value;
      const variantSelect = document.querySelector('select[name="id"]');
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
  const thumbs = document.querySelectorAll('.product-page__thumb');
  const mainImage = document.querySelector('.product-page__main-image img');

  thumbs.forEach(function(thumb) {
    thumb.addEventListener('click', function() {
      thumbs.forEach(function(t) { t.classList.remove('is-active'); });
      this.classList.add('is-active');

      if (mainImage) {
        mainImage.src = this.dataset.src;
        mainImage.srcset = this.dataset.srcset || '';
      }
    });
  });

  /* --- Cart Quantity --- */
  document.querySelectorAll('.cart-item__quantity').forEach(function(wrapper) {
    const minus = wrapper.querySelector('[data-action="decrease"]');
    const plus = wrapper.querySelector('[data-action="increase"]');
    const input = wrapper.querySelector('input');

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

  /* --- Scroll-based header shadow --- */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
      } else {
        header.style.boxShadow = 'none';
      }
    });
  }

})();
