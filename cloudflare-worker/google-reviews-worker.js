/**
 * Cloudflare Worker - Google Reviews Proxy
 * 
 * This worker proxies requests to the Google Places API to fetch
 * real review data while keeping the API key secret.
 * 
 * Required Cloudflare Environment Variables:
 *   - GOOGLE_API_KEY (Secret): Your Google Places API key
 *   - GOOGLE_PLACE_ID (Variable): ChIJf6Gqv77Mc2cR9yV2zeSdS2E
 *   - ALLOWED_ORIGIN (Variable): https://www.carcommercialresidentialemergencylocksmithservice.com
 */

export default {
  async fetch(request, env, ctx) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow GET
    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    // Check origin
    const origin = request.headers.get('Origin') || '';
    const allowedOrigin = env.ALLOWED_ORIGIN || '';
    if (allowedOrigin && origin && !origin.includes(allowedOrigin.replace('https://', '').replace('http://', ''))) {
      return new Response('Forbidden', { status: 403, headers: corsHeaders });
    }

    // Try to get cached response
    const cacheKey = `google-reviews-${env.GOOGLE_PLACE_ID}`;
    const cache = caches.default;
    const cacheUrl = new URL(request.url);
    cacheUrl.pathname = `/${cacheKey}`;
    const cachedResponse = await cache.match(new Request(cacheUrl.toString()));

    if (cachedResponse) {
      // Return cached response with CORS headers
      const response = new Response(cachedResponse.body, cachedResponse);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    try {
      // Fetch from Google Places API
      const placeId = env.GOOGLE_PLACE_ID;
      const apiKey = env.GOOGLE_API_KEY;

      if (!placeId || !apiKey) {
        return new Response(
          JSON.stringify({ error: 'Missing configuration' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const googleUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&key=${apiKey}`;

      const googleResponse = await fetch(googleUrl);
      const googleData = await googleResponse.json();

      if (googleData.status !== 'OK') {
        return new Response(
          JSON.stringify({ error: 'Google API error', status: googleData.status }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Extract only what we need (don't expose unnecessary data)
      const result = googleData.result;
      const responseData = {
        rating: result.rating,
        totalReviews: result.user_ratings_total,
        reviews: (result.reviews || []).slice(0, 5).map(review => ({
          author: review.author_name,
          rating: review.rating,
          text: review.text,
          time: review.relative_time_description,
          profilePhoto: review.profile_photo_url,
        })),
        lastUpdated: new Date().toISOString(),
      };

      // Create response with cache headers (cache for 6 hours)
      const response = new Response(JSON.stringify(responseData), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=21600, s-maxage=21600',
        },
      });

      // Store in Cloudflare cache
      ctx.waitUntil(cache.put(new Request(cacheUrl.toString()), response.clone()));

      return response;

    } catch (err) {
      return new Response(
        JSON.stringify({ error: 'Internal error', message: err.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  },
};
