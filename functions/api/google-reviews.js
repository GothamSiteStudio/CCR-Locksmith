/**
 * Cloudflare Pages Function - Google Reviews Proxy
 * 
 * Route: /api/google-reviews
 * 
 * Fetches real Google reviews while keeping the API key secret.
 * 
 * Required Cloudflare Pages Environment Variables (set in Dashboard):
 *   - GOOGLE_PLACES_API_KEY (encrypted): Your Google Places API key
 *   - GOOGLE_PLACE_ID: ChIJf6Gqv77Mc2cR9yV2zeSdS2E
 */

export async function onRequestGet(context) {
  const { env } = context;

  const API_KEY = env.GOOGLE_PLACES_API_KEY;
  const PLACE_ID = env.GOOGLE_PLACE_ID;

  // CORS headers (same-origin so not strictly needed, but good practice)
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=21600, s-maxage=21600',
    'Access-Control-Allow-Origin': '*',
  };

  if (!API_KEY || !PLACE_ID) {
    return new Response(
      JSON.stringify({ error: 'Missing server configuration (GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID)' }),
      { status: 500, headers }
    );
  }

  try {
    const googleUrl =
      'https://maps.googleapis.com/maps/api/place/details/json' +
      '?place_id=' + encodeURIComponent(PLACE_ID) +
      '&fields=rating,user_ratings_total,reviews' +
      '&reviews_sort=newest' +
      '&key=' + API_KEY;

    const googleResponse = await fetch(googleUrl);
    const googleData = await googleResponse.json();

    if (googleData.status !== 'OK') {
      return new Response(
        JSON.stringify({
          error: 'Google API error',
          status: googleData.status,
          message: googleData.error_message || '',
        }),
        { status: 502, headers }
      );
    }

    const result = googleData.result;
    const responseData = {
      rating: result.rating,
      totalReviews: result.user_ratings_total,
      reviews: (result.reviews || []).map(function (review) {
        return {
          author: review.author_name,
          rating: review.rating,
          text: review.text,
          time: review.relative_time_description,
          profilePhoto: review.profile_photo_url,
        };
      }),
      lastUpdated: new Date().toISOString(),
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers,
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: err.message }),
      { status: 500, headers }
    );
  }
}
