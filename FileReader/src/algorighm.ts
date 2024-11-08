import axios from 'axios';

// Replace with your OpenRouteService API key
const API_KEY = 'YOUR_API_KEY';

// Coordinates for Jenesien and Bozen
const JENESIEN_COORDINATES = [11.34436, 46.55853]; // [Longitude, Latitude]
const BOZEN_COORDINATES = [11.35478, 46.49829];    // [Longitude, Latitude]

/**
 * Fetches the route from Jenesien to Bozen using OpenRouteService API.
 */
async function getRoute() {
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car';

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: API_KEY,
            },
            params: {
                start: JENESIEN_COORDINATES.join(','), // Starting coordinates
                end: BOZEN_COORDINATES.join(','),       // Ending coordinates
            },
        });

        // Display route information
        console.log('Route from Jenesien to Bozen:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching the route:', error);
    }
}

// Run the function
getRoute();
