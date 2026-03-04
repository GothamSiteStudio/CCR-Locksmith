/*
	Helios by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		settings = {

			// Carousels
				carousels: {
					speed: 4,
					fadeIn: true,
					fadeDelay: 250
				},

		};

	// Ensure logo appears as favicon in browser tab.
		(function() {
			var scriptElement = document.currentScript;
			var scriptSrc = scriptElement ? (scriptElement.getAttribute('src') || '') : '';
			var faviconHref = 'images/favicon-logo.png';

			if (scriptSrc.indexOf('../') === 0)
				faviconHref = '../images/favicon-logo.png';
			else if (scriptSrc.indexOf('/') === 0)
				faviconHref = '/images/favicon-logo.png';

			var $head = $('head');

			if ($head.length === 0)
				return;

			var $icon = $head.find('link[rel*="icon"]').first();

			if ($icon.length === 0)
				$icon = $('<link rel="icon" type="image/png">').appendTo($head);

			$icon.attr('href', faviconHref);
		})();

	// Breakpoints.
		breakpoints({
			wide:      [ '1281px',  '1680px' ],
			normal:    [ '961px',   '1280px' ],
			narrow:    [ '841px',   '960px'  ],
			narrower:  [ '737px',   '840px'  ],
			mobile:    [ null,      '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly').scrolly();

	// Nav.

		// Button.
			$(
				'<div id="navButton">' +
					'<a href="#navPanel" class="toggle" aria-label="Open navigation menu" aria-controls="navPanel" aria-expanded="false"></a>' +
				'</div>'
			)
				.appendTo($body);

			var $navToggle = $('#navButton .toggle');
			if ($navToggle.length && window.MutationObserver) {
				var syncNavToggleState = function() {
					$navToggle.attr('aria-expanded', $body.hasClass('navPanel-visible') ? 'true' : 'false');
				};

				syncNavToggleState();

				var navObserver = new MutationObserver(syncNavToggleState);
				navObserver.observe($body[0], {
					attributes: true,
					attributeFilter: ['class']
				});
			}

		// Panel.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					target: $body,
					visibleClass: 'navPanel-visible'
				});

	// Carousels.
		$('.carousel').each(function() {

			var	$t = $(this),
				$forward = $('<span class="forward"></span>'),
				$backward = $('<span class="backward"></span>'),
				$reel = $t.children('.reel'),
				$items = $reel.children('article');

			var	pos = 0,
				leftLimit,
				rightLimit,
				itemWidth,
				reelWidth,
				timerId;

			// Items.
				if (settings.carousels.fadeIn) {

					$items.addClass('loading');

					$t.scrollex({
						mode: 'middle',
						top: '-20vh',
						bottom: '-20vh',
						enter: function() {

							var	timerId,
								limit = $items.length - Math.ceil($window.width() / itemWidth);

							timerId = window.setInterval(function() {
								var x = $items.filter('.loading'), xf = x.first();

								if (x.length <= limit) {

									window.clearInterval(timerId);
									$items.removeClass('loading');
									return;

								}

								xf.removeClass('loading');

							}, settings.carousels.fadeDelay);

						}
					});

				}

			// Main.
				$t._update = function() {
					pos = 0;
					rightLimit = (-1 * reelWidth) + $window.width();
					leftLimit = 0;
					$t._updatePos();
				};

				$t._updatePos = function() { $reel.css('transform', 'translate(' + pos + 'px, 0)'); };

			// Forward.
				$forward
					.appendTo($t)
					.hide()
					.mouseenter(function(e) {
						timerId = window.setInterval(function() {
							pos -= settings.carousels.speed;

							if (pos <= rightLimit)
							{
								window.clearInterval(timerId);
								pos = rightLimit;
							}

							$t._updatePos();
						}, 10);
					})
					.mouseleave(function(e) {
						window.clearInterval(timerId);
					});

			// Backward.
				$backward
					.appendTo($t)
					.hide()
					.mouseenter(function(e) {
						timerId = window.setInterval(function() {
							pos += settings.carousels.speed;

							if (pos >= leftLimit) {

								window.clearInterval(timerId);
								pos = leftLimit;

							}

							$t._updatePos();
						}, 10);
					})
					.mouseleave(function(e) {
						window.clearInterval(timerId);
					});

			// Init.
				$window.on('load', function() {

					reelWidth = $reel[0].scrollWidth;

					if (browser.mobile) {

						$reel
							.css('overflow-y', 'hidden')
							.css('overflow-x', 'scroll')
							.scrollLeft(0);
						$forward.hide();
						$backward.hide();

					}
					else {

						$reel
							.css('overflow', 'visible')
							.scrollLeft(0);
						$forward.show();
						$backward.show();

					}

					$t._update();

					$window.on('resize', function() {
						reelWidth = $reel[0].scrollWidth;
						$t._update();
					}).trigger('resize');

		});

		});

	// Desktop dropdown hover management with delay + cancel.
	// Includes keyboard/focus accessibility and ARIA state updates.
	(function() {
		var $nav = $('#nav');
		if ($nav.length === 0) return;

		if (!$nav.attr('aria-label')) {
			$nav.attr('aria-label', 'Primary');
		}

		var hideTimer = null;

		function getToggle($li) {
			return $li.children('.dropdown-toggle').first();
		}

		function getMenu($li) {
			return $li.children('.dropdown-menu, .mega-menu').first();
		}

		function syncExpandedState($li, expanded) {
			var $toggle = getToggle($li);
			var $menu = getMenu($li);
			if ($toggle.length) {
				$toggle.attr('aria-expanded', expanded ? 'true' : 'false');
			}
			if ($menu.length) {
				$menu.attr('aria-hidden', expanded ? 'false' : 'true');
			}
		}

		function closeItem($li) {
			$li.removeClass('open');
			syncExpandedState($li, false);
		}

		function closeAll(exceptLi) {
			$nav.find('.dropdown.open, .mega-dropdown.open').each(function() {
				var $item = $(this);
				if (exceptLi && $item.is(exceptLi)) return;
				closeItem($item);
			});
		}

		function openItem($li) {
			clearTimeout(hideTimer);
			closeAll($li);
			$li.addClass('open');
			syncExpandedState($li, true);
		}

		function scheduleClose($li, delay) {
			clearTimeout(hideTimer);
			hideTimer = setTimeout(function() {
				closeItem($li);
			}, delay || 200);
		}

		$nav.find('.dropdown, .mega-dropdown').each(function(index) {
			var $li = $(this);
			var $toggle = getToggle($li);
			var $menu = getMenu($li);
			if (!$toggle.length || !$menu.length) return;

			var menuId = $menu.attr('id');
			if (!menuId) {
				menuId = 'nav-submenu-' + index;
				$menu.attr('id', menuId);
			}

			$toggle.attr({
				'aria-haspopup': 'true',
				'aria-expanded': 'false',
				'aria-controls': menuId
			});

			$menu.attr({
				'role': 'menu',
				'aria-hidden': 'true'
			});

			$menu.find('a').attr('role', 'menuitem');
		});

		// Use event delegation for both simple dropdowns and mega menus
		$nav.on('mouseenter', '.dropdown, .mega-dropdown', function() {
			openItem($(this));
		});

		$nav.on('mouseleave', '.dropdown, .mega-dropdown', function() {
			scheduleClose($(this), 200);
		});

		// If user enters a new item quickly, cancel pending close
		$nav.on('mouseenter', '.dropdown > .dropdown-menu, .mega-dropdown > .mega-menu', function() {
			clearTimeout(hideTimer);
		});

		$nav.on('focusin', '.dropdown, .mega-dropdown', function() {
			openItem($(this));
		});

		$nav.on('focusout', '.dropdown, .mega-dropdown', function() {
			var $item = $(this);
			window.setTimeout(function() {
				if (!$item[0].contains(document.activeElement)) {
					closeItem($item);
				}
			}, 50);
		});

		$nav.on('keydown', '.dropdown-toggle', function(event) {
			var key = event.key;
			var $toggle = $(this);
			var $li = $toggle.parent();
			var $menu = getMenu($li);

			if (key === 'Escape') {
				event.preventDefault();
				closeItem($li);
				$toggle.trigger('focus');
				return;
			}

			if (key === 'ArrowDown' || key === ' ') {
				event.preventDefault();
				openItem($li);
				var $firstLink = $menu.find('a:visible').first();
				if ($firstLink.length) {
					$firstLink.trigger('focus');
				}
			}
		});

		$nav.on('keydown', '.dropdown-menu a, .mega-menu a', function(event) {
			if (event.key === 'Escape') {
				event.preventDefault();
				var $li = $(this).closest('.dropdown, .mega-dropdown');
				closeItem($li);
				getToggle($li).trigger('focus');
			}
		});

		$nav.on('click', '.dropdown-toggle', function(event) {
			if (!window.matchMedia || !window.matchMedia('(max-width: 991px)').matches) return;
			var $toggle = $(this);
			var $li = $toggle.parent();
			if (!$li.hasClass('open')) {
				event.preventDefault();
				openItem($li);
			}
		});

		$(document).on('keydown', function(event) {
			if (event.key === 'Escape') {
				closeAll();
			}
		});
	})();

	// Global semantic and form accessibility enhancements.
	(function() {
		if (!document.documentElement.lang) {
			document.documentElement.lang = 'en';
		}

		var mainTarget = document.getElementById('main') || document.querySelector('main') || document.getElementById('page-wrapper');
		if (mainTarget) {
			if (!mainTarget.id) {
				mainTarget.id = 'main-content';
			}
			if (!mainTarget.hasAttribute('tabindex')) {
				mainTarget.setAttribute('tabindex', '-1');
			}

			var skipLink = document.querySelector('.skip-link');
			if (!skipLink) {
				skipLink = document.createElement('a');
				skipLink.className = 'skip-link';
				skipLink.textContent = 'Skip to main content';
				document.body.insertBefore(skipLink, document.body.firstChild);
			}

			skipLink.setAttribute('href', '#' + mainTarget.id);
			skipLink.addEventListener('click', function() {
				window.setTimeout(function() {
					mainTarget.focus();
				}, 0);
			});
		}

		document.querySelectorAll('a[target="_blank"]').forEach(function(link) {
			var rel = (link.getAttribute('rel') || '').toLowerCase();
			if (rel.indexOf('noopener') === -1 || rel.indexOf('noreferrer') === -1) {
				link.setAttribute('rel', 'noopener noreferrer');
			}
		});

		document.querySelectorAll('img:not([alt])').forEach(function(img) {
			img.setAttribute('alt', '');
		});

		document.querySelectorAll('form').forEach(function(form, formIndex) {
			if (!form.hasAttribute('aria-label') && !form.hasAttribute('aria-labelledby')) {
				form.setAttribute('aria-label', 'Contact form');
			}

			var controls = form.querySelectorAll('input, textarea, select');
			controls.forEach(function(control, fieldIndex) {
				var type = (control.getAttribute('type') || '').toLowerCase();
				if (type === 'hidden' || type === 'submit' || type === 'button' || type === 'reset') return;

				if (!control.id) {
					control.id = 'form-' + formIndex + '-field-' + fieldIndex;
				}

				var labelSelector = 'label[for="' + control.id + '"]';
				var hasLabel = !!form.querySelector(labelSelector);
				var hasAriaLabel = control.hasAttribute('aria-label') || control.hasAttribute('aria-labelledby');
				if (!hasLabel && !hasAriaLabel) {
					var text = control.getAttribute('placeholder') || control.getAttribute('name') || 'Field';
					text = text.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
					if (!text) text = 'Field';
					if (control.parentNode) {
						var generatedLabel = document.createElement('label');
						generatedLabel.className = 'sr-only';
						generatedLabel.setAttribute('for', control.id);
						generatedLabel.textContent = text;
						control.parentNode.insertBefore(generatedLabel, control);
					}
					control.setAttribute('aria-label', text);
				}

				if (!control.getAttribute('autocomplete')) {
					var nameAttr = (control.getAttribute('name') || '').toLowerCase();
					if (type === 'email' || nameAttr.indexOf('email') !== -1) {
						control.setAttribute('autocomplete', 'email');
					} else if (type === 'tel' || nameAttr.indexOf('phone') !== -1 || nameAttr.indexOf('tel') !== -1 || nameAttr.indexOf('mobile') !== -1) {
						control.setAttribute('autocomplete', 'tel');
						if (!control.getAttribute('inputmode')) {
							control.setAttribute('inputmode', 'tel');
						}
					} else if (nameAttr === 'name' || nameAttr.indexOf('full-name') !== -1 || nameAttr.indexOf('fullname') !== -1) {
						control.setAttribute('autocomplete', 'name');
					}
				}
			});

			var formMessage = form.parentElement && form.parentElement.querySelector('#formMessage, .form-message, [data-form-message]');
			if (formMessage) {
				if (!formMessage.hasAttribute('role')) {
					formMessage.setAttribute('role', 'status');
				}
				if (!formMessage.hasAttribute('aria-live')) {
					formMessage.setAttribute('aria-live', 'polite');
				}
			}
		});
	})();

})(jQuery);
