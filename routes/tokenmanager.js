// tokenManager.js
// tokenManager.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

let accessToken = null;
let tokenExpiryTime = 0; // Stores expiry as Unix timestamp in milliseconds

/**
 * Retrieves a valid access token.
 * Uses a cached token if available and not expired; otherwise, fetches a new one.
 */
export async function getAccessToken() {
  const currentTime = Date.now();
//   console.log(accessToken);
  // If a token exists and is still valid, return it.
  if (accessToken && currentTime < tokenExpiryTime) {
    console.log('Using cached token');
    return accessToken;
  }

  // Otherwise, fetch a new token from the authentication endpoint.
  try {
    const response = await axios.post('https://api.sandbox.co.in/authenticate', null, {
      headers: {
        'x-api-key': process.env.apiKey,      // e.g., key_live_...
        'x-api-secret': process.env.apiSecret,  // your API secret
        'x-api-version': '2.0'
      }
    });

    if (response.data && response.data.access_token) {
      accessToken = response.data.access_token;
      // The token is valid for 24 hours (86400 seconds).
      // Here we set the expiry 10 minutes before the actual expiry for safety.
      tokenExpiryTime = currentTime + (86400 - 600) * 1000;
      console.log('New token generated');
      return accessToken;
    } else {
      throw new Error('Access token not found in response');
    }
  } catch (error) {
    console.error(
      'Error fetching new access token:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}
