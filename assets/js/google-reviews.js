/**
 * Google Reviews Widget
 * Fetches real Google reviews from Cloudflare Worker proxy
 * and updates the trust bar + optional review carousel
 */
(function () {
  'use strict';

  // ============================================================
  // CONFIGURATION — Update the worker URL after deploying
  // ============================================================
  var WORKER_URL = 'https://google-reviews-proxy.YOUR-SUBDOMAIN.workers.dev';

  // Fallback values (shown while loading or if API fails)
  var FALLBACK_RATING = '4.9';
  var FALLBACK_REVIEW_COUNT = '150';

  // Google Maps review URL for the business
  var GOOGLE_REVIEW_URL = 'https://search.google.com/local/reviews?placeid=ChIJf6Gqv77Mc2cR9yV2zeSdS2E';

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
   * Populate the review carousel/section if it exists
   */
  function populateReviews(reviews) {
    var container = document.getElementById('google-reviews-container');
    if (!container || !reviews || reviews.length === 0) return;

    var html = '';
    reviews.forEach(function (review) {
      if (review.rating < 4) return; // Only show 4-5 star reviews
      html += '<div class="google-review-card">' +
        '<div class="review-header">' +
        (review.profilePhoto ? '<img src="' + review.profilePhoto + '" alt="" class="review-avatar" width="36" height="36" loading="lazy">' : '') +
        '<strong class="review-author">' + escapeHtml(review.author) + '</strong>' +
        '<span class="review-time">' + escapeHtml(review.time) + '</span>' +
        '</div>' +
        '<div class="review-stars">' + generateStars(review.rating) + '</div>' +
        '<p class="review-text">' + escapeHtml(truncate(review.text, 180)) + '</p>' +
        '</div>';
    });

    container.innerHTML = html;
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
   * Fetch reviews from Cloudflare Worker
   */
  function fetchReviews() {
    // Check for cached data in sessionStorage (avoid multiple fetches per session)
    var cached = sessionStorage.getItem('ccr_google_reviews');
    if (cached) {
      try {
        var data = JSON.parse(cached);
        // Use cache if less than 1 hour old
        if (data._fetchedAt && (Date.now() - data._fetchedAt) < 3600000) {
          updateTrustBar(data);
          populateReviews(data.reviews);
          return;
        }
      } catch (e) { /* ignore parse errors */ }
    }

    fetch(WORKER_URL)
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
        // Keep fallback values — the HTML already shows them
      });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchReviews);
  } else {
    fetchReviews();
  }

})();
