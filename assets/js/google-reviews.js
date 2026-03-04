/**
 * Google Reviews Widget
 * Fetches real verified Google reviews via Cloudflare Pages Function
 * and displays them in a scrolling carousel in the header area.
 */
(function () {
  'use strict';

  // ============================================================
  // CONFIGURATION
  // ============================================================
  var API_URL = '/api/google-reviews';

  // Fallback values (shown while loading or if API fails)
  var FALLBACK_RATING = '4.9';
  var FALLBACK_REVIEW_COUNT = '150';

  // Google Maps review URL for the business
  var GOOGLE_REVIEW_URL = 'https://search.google.com/local/reviews?placeid=ChIJf6Gqv77Mc2cR9yV2zeSdSmE';

  // Auto-scroll interval (ms)
  var SCROLL_INTERVAL = 5000;

  // ============================================================

  /**
   * Generate star icons HTML from a numeric rating
   */
  function generateStars(rating) {
    var html = '';
    var fullStars = Math.floor(rating);
    var hasHalf = (rating - fullStars) >= 0.3;

    for (var i = 0; i < fullStars; i++) {
      html += '<i class="fas fa-star" style="color:#ffc107" aria-hidden="true"></i>';
    }
    if (hasHalf) {
      html += '<i class="fas fa-star-half-alt" style="color:#ffc107" aria-hidden="true"></i>';
    }
    var totalShown = fullStars + (hasHalf ? 1 : 0);
    for (var j = totalShown; j < 5; j++) {
      html += '<i class="far fa-star" style="color:#ffc107" aria-hidden="true"></i>';
    }
    return html;
  }

  /**
   * Update the trust bar rating element
   */
  function updateTrustBar(data) {
    var el = document.getElementById('google-rating-value');
    if (!el) return;

    var rating = data.rating || FALLBACK_RATING;
    var count = data.totalReviews || FALLBACK_REVIEW_COUNT;

    el.innerHTML = generateStars(rating) +
      ' <strong>' + rating + '</strong>' +
      ' <span class="review-count">(' + count + ' reviews)</span>';
  }

  /**
   * Populate the review carousel in the header area
   */
  function populateReviews(reviews) {
    var container = document.getElementById('google-reviews-container');
    if (!container || !reviews || reviews.length === 0) return;

    var goodReviews = reviews.filter(function (r) { return r.rating >= 4; });
    if (goodReviews.length === 0) return;

    var html = '<div class="google-reviews-track">';
    goodReviews.forEach(function (review) {
      html += '<div class="google-review-card">' +
        '<div class="review-header-row">' +
        (review.profilePhoto
          ? '<img src="' + escapeHtml(review.profilePhoto) + '" alt="" class="review-avatar" width="40" height="40" loading="lazy">'
          : '<div class="review-avatar-placeholder"><i class="fas fa-user"></i></div>') +
        '<div class="review-meta">' +
        '<strong class="review-author">' + escapeHtml(review.author) + '</strong>' +
        '<div class="review-stars">' + generateStars(review.rating) + '</div>' +
        '</div>' +
        '<img src="https://www.google.com/favicon.ico" alt="Verified Google Review" class="review-google-badge" width="16" height="16" title="Verified Google Review">' +
        '</div>' +
        '<p class="review-text">' + escapeHtml(truncate(review.text, 160)) + '</p>' +
        '<span class="review-time">' + escapeHtml(review.time) + '</span>' +
        '</div>';
    });
    html += '</div>';

    container.innerHTML = html;
    container.style.display = 'block';

    setupAutoScroll(container, goodReviews.length);
  }

  /**
   * Auto-scroll through review cards
   */
  function setupAutoScroll(container, totalCards) {
    if (totalCards <= 1) return;

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    var track = container.querySelector('.google-reviews-track');
    if (!track) return;

    var currentIndex = 0;
    var isPaused = false;

    container.addEventListener('mouseenter', function () { isPaused = true; });
    container.addEventListener('mouseleave', function () { isPaused = false; });
    container.addEventListener('focusin', function () { isPaused = true; });
    container.addEventListener('focusout', function () { isPaused = false; });
    container.addEventListener('touchstart', function () { isPaused = true; }, { passive: true });
    container.addEventListener('touchend', function () {
      setTimeout(function () { isPaused = false; }, 3000);
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      isPaused = document.hidden;
    });

    setInterval(function () {
      if (isPaused) return;
      currentIndex = (currentIndex + 1) % totalCards;
      var offset = currentIndex * 100;
      track.style.transform = 'translateX(-' + offset + '%)';
    }, SCROLL_INTERVAL);
  }

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function truncate(str, len) {
    if (!str) return '';
    return str.length > len ? str.substring(0, len) + '…' : str;
  }

  /**
   * Fetch reviews from Cloudflare Pages Function
   */
  function fetchReviews() {
    var cached = sessionStorage.getItem('ccr_google_reviews');
    if (cached) {
      try {
        var data = JSON.parse(cached);
        if (data._fetchedAt && (Date.now() - data._fetchedAt) < 3600000) {
          updateTrustBar(data);
          populateReviews(data.reviews);
          return;
        }
      } catch (e) { /* ignore parse errors */ }
    }

    fetch(API_URL)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        data._fetchedAt = Date.now();
        sessionStorage.setItem('ccr_google_reviews', JSON.stringify(data));
        updateTrustBar(data);
        populateReviews(data.reviews);
      })
      .catch(function (err) {
        console.warn('Google Reviews fetch failed:', err.message);
      });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchReviews);
  } else {
    fetchReviews();
  }

})();
