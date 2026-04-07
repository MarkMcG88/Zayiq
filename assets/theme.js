/**
 * Zayiq Theme JavaScript
 * Bold Artist-Collaboration Apparel
 */

(function() {
  'use strict';

  /* =========================================
     Scroll Reveal
     ========================================= */
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

  /* =========================================
     Header Scroll State
     ========================================= */
  var header = document.querySelector('.header');

  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  /* =========================================
     Mobile Menu
     ========================================= */
  var menuToggle = document.querySelector('.header__menu-toggle');
  var headerNav = document.querySelector('.header__nav');

  if (menuToggle && headerNav) {
    menuToggle.addEventListener('click', function() {
      headerNav.classList.toggle('is-open');
      var isOpen = headerNav.classList.contains('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  /* =========================================
     Shared: Close on Escape
     ========================================= */
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Escape') return;

    // Close mobile menu
    if (headerNav && headerNav.classList.contains('is-open')) {
      headerNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    // Close cart drawer
    closeCartDrawer();

    // Close search
    closeSearch();

    // Close quick view
    closeQuickView();

    // Close size guide
    closeSizeGuide();
  });

  /* =========================================
     Cart Drawer
     ========================================= */
  var cartDrawer = document.getElementById('CartDrawer');

  function openCartDrawer() {
    if (!cartDrawer) return;
    cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    if (!cartDrawer) return;
    cartDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-cart-drawer-open]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openCartDrawer();
    });
  });

  document.querySelectorAll('[data-cart-drawer-close]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      if (e.target.closest('a') && !e.target.hasAttribute('data-cart-drawer-close')) return;
      closeCartDrawer();
    });
  });

  /* =========================================
     Predictive Search
     ========================================= */
  var searchOverlay = document.getElementById('PredictiveSearch');
  var searchInput = document.getElementById('PredictiveSearchInput');
  var searchResults = document.getElementById('PredictiveSearchResults');
  var searchDebounce = null;

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (searchInput) {
      setTimeout(function() { searchInput.focus(); }, 100);
    }
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-search-open]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openSearch();
    });
  });

  document.querySelectorAll('[data-search-close]').forEach(function(btn) {
    btn.addEventListener('click', closeSearch);
  });

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', function() {
      var query = this.value.trim();
      clearTimeout(searchDebounce);

      if (query.length < 2) {
        searchResults.querySelector('.predictive-search__content').innerHTML = '';
        searchResults.querySelector('.predictive-search__loading').style.display = 'none';
        return;
      }

      searchResults.querySelector('.predictive-search__loading').style.display = 'block';

      searchDebounce = setTimeout(function() {
        fetch('/search/suggest.json?q=' + encodeURIComponent(query) + '&resources[type]=product,article,collection&resources[limit]=6')
          .then(function(r) { return r.json(); })
          .then(function(data) {
            searchResults.querySelector('.predictive-search__loading').style.display = 'none';
            var html = '';
            var resources = data.resources.results;

            if (resources.products && resources.products.length > 0) {
              html += '<p class="predictive-search__group-title">Products</p>';
              resources.products.forEach(function(p) {
                var img = p.image ? '<img class="predictive-search__item-image" src="' + p.image + '" alt="" loading="lazy">' : '';
                html += '<a href="' + p.url + '" class="predictive-search__item">' + img + '<div><strong>' + p.title + '</strong><br><span style="opacity:0.5;font-size:0.8125rem;">' + p.price + '</span></div></a>';
              });
            }

            if (resources.articles && resources.articles.length > 0) {
              html += '<p class="predictive-search__group-title" style="margin-top:20px;">Stories</p>';
              resources.articles.forEach(function(a) {
                html += '<a href="' + a.url + '" class="predictive-search__item"><div><strong>' + a.title + '</strong></div></a>';
              });
            }

            if (resources.collections && resources.collections.length > 0) {
              html += '<p class="predictive-search__group-title" style="margin-top:20px;">Collections</p>';
              resources.collections.forEach(function(c) {
                html += '<a href="' + c.url + '" class="predictive-search__item"><div><strong>' + c.title + '</strong></div></a>';
              });
            }

            if (!html) {
              html = '<p style="opacity:0.5;text-align:center;padding:20px 0;">No results for "' + query + '"</p>';
            }

            html += '<a href="/search?q=' + encodeURIComponent(query) + '" style="display:block;text-align:center;margin-top:20px;font-size:0.8125rem;text-decoration:underline;">View all results</a>';

            searchResults.querySelector('.predictive-search__content').innerHTML = html;
          })
          .catch(function() {
            searchResults.querySelector('.predictive-search__loading').style.display = 'none';
          });
      }, 300);
    });
  }

  /* =========================================
     Quick View
     ========================================= */
  var quickView = document.getElementById('QuickView');

  function closeQuickView() {
    if (!quickView) return;
    quickView.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-quick-view]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var url = this.dataset.quickView;
      if (!quickView || !url) return;

      quickView.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      var content = quickView.querySelector('.quick-view__content');
      content.innerHTML = '<div class="quick-view__loading"><div class="predictive-search__spinner"></div></div>';

      fetch(url + '?section_id=product-page')
        .then(function(r) { return r.text(); })
        .then(function(html) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, 'text/html');
          var productSection = doc.querySelector('.product-page__inner');
          if (productSection) {
            content.innerHTML = productSection.outerHTML;
          } else {
            content.innerHTML = '<p style="text-align:center;padding:40px;">Unable to load product details. <a href="' + url + '" style="text-decoration:underline;">View full page</a></p>';
          }
        })
        .catch(function() {
          content.innerHTML = '<p style="text-align:center;padding:40px;">Unable to load product details. <a href="' + url + '" style="text-decoration:underline;">View full page</a></p>';
        });
    });
  });

  document.querySelectorAll('[data-quick-view-close]').forEach(function(btn) {
    btn.addEventListener('click', closeQuickView);
  });

  /* =========================================
     Size Guide
     ========================================= */
  var sizeGuide = document.getElementById('SizeGuide');

  function closeSizeGuide() {
    if (!sizeGuide) return;
    sizeGuide.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-size-guide-open]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      if (!sizeGuide) return;
      sizeGuide.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  document.querySelectorAll('[data-size-guide-close]').forEach(function(btn) {
    btn.addEventListener('click', closeSizeGuide);
  });

  /* =========================================
     Back to Top
     ========================================= */
  var backToTop = document.getElementById('BackToTop');

  if (backToTop) {
    backToTop.style.display = '';

    window.addEventListener('scroll', function() {
      if (window.scrollY > 600) {
        backToTop.classList.add('is-visible');
      } else {
        backToTop.classList.remove('is-visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =========================================
     Sticky Add to Cart (Product Page)
     ========================================= */
  var stickyATC = document.getElementById('StickyATC');
  var addToCartBtn = document.querySelector('.product-page__add-to-cart');

  if (stickyATC && addToCartBtn) {
    var stickyObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          stickyATC.classList.remove('is-visible');
        } else {
          stickyATC.classList.add('is-visible');
        }
      });
    }, { threshold: 0 });

    stickyObserver.observe(addToCartBtn);
  }

  /* =========================================
     Accordions
     ========================================= */
  document.querySelectorAll('[data-accordion-trigger]').forEach(function(trigger) {
    trigger.addEventListener('click', function() {
      var content = this.nextElementSibling;
      var isOpen = this.getAttribute('aria-expanded') === 'true';

      this.setAttribute('aria-expanded', !isOpen);

      if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    });
  });

  /* =========================================
     Product Page: Variant Selector
     ========================================= */
  document.querySelectorAll('.product-page__variant-option, .product-page__color-swatch').forEach(function(option) {
    option.addEventListener('click', function() {
      var group = this.closest('.product-page__variant-options');
      group.querySelectorAll('.product-page__variant-option, .product-page__color-swatch').forEach(function(o) {
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

  /* =========================================
     Product Page: Quantity Selector
     ========================================= */
  document.querySelectorAll('.product-page__quantity').forEach(function(wrapper) {
    var minus = wrapper.querySelector('[data-action="decrease"]');
    var plus = wrapper.querySelector('[data-action="increase"]');
    var input = wrapper.querySelector('input');

    if (minus && plus && input) {
      minus.addEventListener('click', function() {
        var val = parseInt(input.value) - 1;
        if (val >= 1) input.value = val;
      });
      plus.addEventListener('click', function() {
        input.value = parseInt(input.value) + 1;
      });
    }
  });

  /* =========================================
     Product Page: Image Gallery
     ========================================= */
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

  /* =========================================
     Image Zoom (Product Page)
     ========================================= */
  document.querySelectorAll('[data-image-zoom]').forEach(function(container) {
    container.addEventListener('mousemove', function(e) {
      var img = this.querySelector('img');
      if (!img || window.innerWidth < 768) return;
      var rect = this.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      img.style.transformOrigin = x + '% ' + y + '%';
      img.style.transform = 'scale(1.8)';
    });

    container.addEventListener('mouseleave', function() {
      var img = this.querySelector('img');
      if (img) {
        img.style.transform = 'scale(1)';
        img.style.transformOrigin = 'center center';
      }
    });
  });

  /* =========================================
     Cart Quantity (Cart Page)
     ========================================= */
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
        input.value = parseInt(input.value) + 1;
        input.dispatchEvent(new Event('change'));
      });
    }
  });

  /* =========================================
     Copy URL (Social Share)
     ========================================= */
  document.querySelectorAll('[data-copy-url]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var url = this.dataset.copyUrl;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function() {
          btn.setAttribute('title', 'Copied!');
          setTimeout(function() { btn.removeAttribute('title'); }, 2000);
        });
      }
    });
  });

  /* =========================================
     Collection Filters Toggle
     ========================================= */
  var filterToggle = document.getElementById('FilterToggle');
  var filterPanel = document.getElementById('CollectionFilters');
  var filterClose = document.getElementById('FilterClose');

  if (filterToggle && filterPanel) {
    filterToggle.addEventListener('click', function() {
      var isOpen = filterPanel.getAttribute('aria-hidden') === 'false';
      filterPanel.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
      filterToggle.setAttribute('aria-expanded', !isOpen);
    });
  }

  if (filterClose && filterPanel) {
    filterClose.addEventListener('click', function() {
      filterPanel.setAttribute('aria-hidden', 'true');
      if (filterToggle) filterToggle.setAttribute('aria-expanded', 'false');
    });
  }

  /* Filter group toggles */
  document.querySelectorAll('[data-filter-toggle]').forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      var isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      var content = this.nextElementSibling;
      if (content) {
        content.style.display = isExpanded ? 'none' : 'block';
      }
    });
  });

  /* Sort select */
  var sortSelect = document.querySelector('[data-sort-select]');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      var url = window.location.pathname + '?sort_by=' + this.value;
      window.location.href = url;
    });
  }

  /* Grid view toggle */
  document.querySelectorAll('[data-view]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('[data-view]').forEach(function(b) { b.classList.remove('is-active'); });
      this.classList.add('is-active');

      var grid = document.getElementById('ProductGrid');
      if (!grid) return;

      grid.classList.remove('grid--2', 'grid--3', 'grid--4');
      grid.classList.add('grid--' + this.dataset.view.replace('grid-', ''));
    });
  });

  /* =========================================
     Marquee: Duplicate for Seamless Loop
     ========================================= */
  document.querySelectorAll('.announcement-bar__track, .brand-ticker__track').forEach(function(track) {
    var clone = track.innerHTML;
    track.innerHTML = clone + clone;
  });

  /* =========================================
     Countdown Timer
     ========================================= */
  document.querySelectorAll('[data-countdown]').forEach(function(timer) {
    var target = new Date(timer.dataset.countdown).getTime();
    var daysEl = timer.querySelector('[data-days]');
    var hoursEl = timer.querySelector('[data-hours]');
    var minutesEl = timer.querySelector('[data-minutes]');
    var secondsEl = timer.querySelector('[data-seconds]');

    if (!daysEl || !target) return;

    function update() {
      var now = Date.now();
      var diff = Math.max(0, target - now);

      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  });

  /* =========================================
     Shop the Look Hotspots
     ========================================= */
  document.querySelectorAll('[data-hotspot]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var id = this.dataset.hotspot;
      var card = document.querySelector('[data-hotspot-card="' + id + '"]');

      // Close all other cards
      document.querySelectorAll('.shop-look__hotspot-card').forEach(function(c) {
        if (c !== card) c.classList.remove('is-active');
      });

      if (card) {
        card.classList.toggle('is-active');
        // Position card near the hotspot
        card.style.left = this.style.left;
        card.style.top = this.style.top;
      }
    });
  });

  // Close hotspot cards when clicking elsewhere
  document.addEventListener('click', function() {
    document.querySelectorAll('.shop-look__hotspot-card').forEach(function(c) {
      c.classList.remove('is-active');
    });
  });

  /* =========================================
     Parallax Effect (lightweight)
     ========================================= */
  var parallaxElements = document.querySelectorAll('[data-parallax]');

  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', function() {
      var scrollY = window.scrollY;
      parallaxElements.forEach(function(el) {
        var speed = parseFloat(el.dataset.parallax) || 0.3;
        var rect = el.getBoundingClientRect();
        var offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
        el.style.transform = 'translateY(' + (-offset * 0.15) + 'px)';
      });
    }, { passive: true });
  }

})();
