import axios from 'axios';

const AMADEUS_BASE_URL = 'https://test.api.amadeus.com/v1';
const CLIENT_ID = import.meta.env.VITE_AMADEUS_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_AMADEUS_CLIENT_SECRET;

let cachedToken = null;

// Function to get the OAuth2 Token (Requirement 2)
const getAccessToken = async () => {
  if (cachedToken) return cachedToken;

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);

    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      params
    );
    cachedToken = response.data.access_token;
    
    // Token usually expires in 30 mins, clear cache after 28 mins
    setTimeout(() => { cachedToken = null; }, 28 * 60 * 1000);
    
    return cachedToken;
  } catch (error) {
    console.error("Auth Error:", error.response?.data || error.message);
    throw new Error("Failed to authenticate with Amadeus API");
  }
};

// Fetch Hotels with Filters (Requirement 3)
export const searchHotels = async (cityCode, filters = {}) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(
      `${AMADEUS_BASE_URL}/reference-data/locations/hotels/by-city`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          cityCode: cityCode, // e.g., 'PAR' for Paris
          ...filters
        }
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Search Error:", error.message);
    return []; // Return empty array to avoid crashing UI
  }
};
