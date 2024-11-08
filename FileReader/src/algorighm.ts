// Replace with your OpenRouteService API key
const API_KEY = 'YOUR_API_KEY';

// Coordinates for Jenesien and Bozen
const JENESIEN_COORDINATES = [11.34436, 46.55853]; // [Longitude, Latitude]
const BOZEN_COORDINATES = [11.35478, 46.49829];    // [Longitude, Latitude]

/**
 * Fetches the route from Jenesien to Bozen using OpenRouteService API.
 */
async function getRoute() {
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?start=${JENESIEN_COORDINATES.join(',')}&end=${BOZEN_COORDINATES.join(',')}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching the route: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Route from Jenesien to Bozen:', data);
        return data;
    } catch (error) {
        console.error('Error fetching the route:', error);
    }
}

// Run the function
getRoute();
