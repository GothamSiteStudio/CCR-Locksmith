(function () {
	'use strict';

	if (window.__ccrPerformanceLoader) {
		return;
	}

	window.__ccrPerformanceLoader = true;

	var GA_ID = 'G-G1CZ4BTQTH';
	var CLARITY_ID = 'v3l3frl9lq';
	var MATOMO_BASE = 'https://matomo.alphalockandsafe.com/matomo/';
	var MATOMO_SITE_ID = '3';
	var ASSET_FILE = 'performance-loader.js';
	var currentScript = document.currentScript || document.querySelector('script[src*="' + ASSET_FILE + '"]');
	var scriptSrc = currentScript ? (currentScript.getAttribute('src') || '') : '';
	var assetPrefix = scriptSrc.replace(/performance-loader\.js(?:\?.*)?$/, '');
	var interactionEvents = ['pointerdown', 'keydown', 'touchstart', 'focusin'];
	var mainBundleLoaded = false;
	var analyticsLoaded = false;

	if (!assetPrefix) {
		assetPrefix = 'assets/js/';
	}

	function runAfterLoad(callback) {
		if (document.readyState === 'complete') {
			callback();
			return;
		}

		window.addEventListener('load', callback, { once: true });
	}

	function runWhenIdle(callback, timeout) {
		if ('requestIdleCallback' in window) {
			window.requestIdleCallback(callback, { timeout: timeout || 2000 });
			return;
		}

		window.setTimeout(callback, 1);
	}

	function loadScript(src, callback) {
		var script = document.createElement('script');
		script.src = src;
		script.async = true;
		script.defer = true;
		if ('fetchPriority' in script) {
			script.fetchPriority = 'low';
		}
		if (callback) {
			script.onload = callback;
		}
		(document.body || document.head || document.documentElement).appendChild(script);
	}

	function loadScriptsSequentially(sources, done) {
		var index = 0;

		function next() {
			if (index >= sources.length) {
				if (done) {
					done();
				}
				return;
			}

			loadScript(sources[index], function () {
				index += 1;
				next();
			});
		}

		next();
	}

	function removeInteractionListeners() {
		interactionEvents.forEach(function (eventName) {
			window.removeEventListener(eventName, loadMainBundle, true);
		});
	}

	function loadMainBundle() {
		if (mainBundleLoaded) {
			return;
		}

		mainBundleLoaded = true;
		removeInteractionListeners();

		var scripts = [
			assetPrefix + 'jquery.min.js',
			assetPrefix + 'browser.min.js',
			assetPrefix + 'breakpoints.min.js',
			assetPrefix + 'util.js'
		];

		if (document.querySelector('.scrolly')) {
			scripts.push(assetPrefix + 'jquery.scrolly.min.js');
		}

		if (document.querySelector('.carousel')) {
			scripts.push(assetPrefix + 'jquery.scrollex.min.js');
		}

		scripts.push(assetPrefix + 'main.js');

		if (document.getElementById('google-rating-value') || document.getElementById('google-reviews-container')) {
			scripts.push(assetPrefix + 'google-reviews.js');
		}

		loadScriptsSequentially(scripts);
	}

	function initGoogleAnalytics() {
		window.dataLayer = window.dataLayer || [];
		window.gtag = window.gtag || function () {
			window.dataLayer.push(arguments);
		};

		window.gtag('js', new Date());
		window.gtag('config', GA_ID);
		loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID));
	}

	function initClarity() {
		window.clarity = window.clarity || function () {
			(window.clarity.q = window.clarity.q || []).push(arguments);
		};

		loadScript('https://www.clarity.ms/tag/' + CLARITY_ID);
	}

	function initMatomo() {
		var _paq = window._paq = window._paq || [];

		_paq.push(['setDocumentTitle', document.domain + '/' + document.title]);
		_paq.push(['setCookieDomain', '*.carcommercialresidentialemergencylocksmithservice.com']);
		_paq.push(['setDomains', ['*.carcommercialresidentialemergencylocksmithservice.com']]);
		_paq.push(['trackPageView']);
		_paq.push(['enableLinkTracking']);
		_paq.push(['setTrackerUrl', MATOMO_BASE + 'matomo.php']);
		_paq.push(['setSiteId', MATOMO_SITE_ID]);

		loadScript(MATOMO_BASE + 'matomo.js');
	}

	function loadAnalytics() {
		if (analyticsLoaded) {
			return;
		}

		analyticsLoaded = true;
		initGoogleAnalytics();
		initClarity();
		initMatomo();
	}

	interactionEvents.forEach(function (eventName) {
		window.addEventListener(eventName, loadMainBundle, { once: true, passive: true, capture: true });
	});

	runAfterLoad(function () {
		runWhenIdle(loadMainBundle, 1500);
		runWhenIdle(loadAnalytics, 3500);
	});
})();