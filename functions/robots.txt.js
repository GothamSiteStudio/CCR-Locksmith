const ROBOTS_TEXT = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://www.carcommercialresidentialemergencylocksmithservice.com/sitemap.xml

# Disallow admin/private pages
Disallow: /partials/
Disallow: /formspree-alternative.html
Disallow: /left-sidebar.html
Disallow: /right-sidebar.html
Disallow: /no-sidebar.html

# ============================================
# Block nested/duplicate URL patterns
# These were created by relative links being crawled incorrectly
# ============================================

# Block any URL with nested category folders (these should not exist)
Disallow: /residential/residential/
Disallow: /residential/commercial/
Disallow: /residential/emergency/
Disallow: /residential/automotive/
Disallow: /residential/service-areas/
Disallow: /residential/prices/
Disallow: /residential/blog/

Disallow: /commercial/residential/
Disallow: /commercial/commercial/
Disallow: /commercial/emergency/
Disallow: /commercial/automotive/
Disallow: /commercial/service-areas/
Disallow: /commercial/prices/
Disallow: /commercial/blog/

Disallow: /emergency/residential/
Disallow: /emergency/commercial/
Disallow: /emergency/emergency/
Disallow: /emergency/automotive/
Disallow: /emergency/service-areas/
Disallow: /emergency/prices/
Disallow: /emergency/blog/

Disallow: /automotive/residential/
Disallow: /automotive/commercial/
Disallow: /automotive/emergency/
Disallow: /automotive/automotive/
Disallow: /automotive/service-areas/
Disallow: /automotive/prices/
Disallow: /automotive/blog/

Disallow: /service-areas/residential/
Disallow: /service-areas/commercial/
Disallow: /service-areas/emergency/
Disallow: /service-areas/automotive/
Disallow: /service-areas/service-areas/
Disallow: /service-areas/prices/
Disallow: /service-areas/blog/

Disallow: /prices/residential/
Disallow: /prices/commercial/
Disallow: /prices/emergency/
Disallow: /prices/automotive/
Disallow: /prices/service-areas/
Disallow: /prices/prices/
Disallow: /prices/blog/

Disallow: /blog/residential/
Disallow: /blog/commercial/
Disallow: /blog/emergency/
Disallow: /blog/automotive/
Disallow: /blog/service-areas/
Disallow: /blog/prices/
Disallow: /blog/blog/

# Explicit AI crawler blocks using standard robots directives.
# This keeps the file valid for PageSpeed/Lighthouse without Content-Signal.

User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: meta-externalagent
Disallow: /
`;

const HEADERS = {
  'Content-Type': 'text/plain; charset=UTF-8',
  'Cache-Control': 'public, max-age=3600, s-maxage=3600',
  'X-Content-Type-Options': 'nosniff',
};

export function onRequest(context) {
  const { method } = context.request;

  if (method !== 'GET' && method !== 'HEAD') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: {
        Allow: 'GET, HEAD',
      },
    });
  }

  return new Response(method === 'HEAD' ? null : ROBOTS_TEXT, {
    status: 200,
    headers: HEADERS,
  });
}