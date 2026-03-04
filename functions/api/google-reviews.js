/**
 * Cloudflare Pages Function - Google Reviews Proxy
 * 
 * Route: /api/google-reviews
 * 
 * Fetches real Google reviews using Places API (New) while keeping the API key secret.
 * 
 * Required Cloudflare Pages Environment Variables (set in Dashboard):
 *   - GOOGLE_PLACES_API_KEY (encrypted): Your Google Places API key
 *   - GOOGLE_PLACE_ID: ChIJf6Gqv77Mc2cR9yV2zeSdSmE
 */

export async function onRequestGet(context) {
  const { env } = context;

  const API_KEY = env.GOOGLE_PLACES_API_KEY;
  const PLACE_ID = env.GOOGLE_PLACE_ID;

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
    // Use Places API (New) - the legacy API does not find this Place ID
    const googleUrl = 'https://places.googleapis.com/v1/places/' + PLACE_ID;

    const googleResponse = await fetch(googleUrl, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,reviews',
      },
    });

    if (!googleResponse.ok) {
      const errorText = await googleResponse.text();
      return new Response(
        JSON.stringify({
          error: 'Google API error',
          status: googleResponse.status,
          message: errorText,
        }),
        { status: 502, headers }
      );
    }

    const googleData = await googleResponse.json();

    const responseData = {
      rating: googleData.rating,
      totalReviews: googleData.userRatingCount,
      reviews: (googleData.reviews || []).map(function (review) {
        return {
          author: review.authorAttribution ? review.authorAttribution.displayName : 'Anonymous',
          rating: review.rating,
          text: review.text ? review.text.text : '',
          time: review.relativePublishTimeDescription || '',
          profilePhoto: review.authorAttribution ? review.authorAttribution.photoUri : '',
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
