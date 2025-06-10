// Radius of the Earth in kilometers
const EARTH_RADIUS = 6371;

interface Coordinates {
  lat: number;
  lng: number;
}

// Convert degrees to radians
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Get coordinates from city and country
// TODO: Replace with actual geocoding service
function getMockCoordinates(city: string, country: string): Coordinates {
  // Mock coordinates for common cities
  const coordinates: Record<string, Coordinates> = {
    'Paris,France': { lat: 48.8566, lng: 2.3522 },
    'London,UK': { lat: 51.5074, lng: -0.1278 },
    'New York,USA': { lat: 40.7128, lng: -74.0060 },
    // Add more cities as needed
  };

  const key = `${city},${country}`;
  return coordinates[key] || { lat: 0, lng: 0 };
}

/**
 * Calculate the distance between two points using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in kilometers
 */
function calculateHaversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return EARTH_RADIUS * c;
}

/**
 * Calculate the distance between two locations using city and country
 * @param city1 First city
 * @param country1 First country
 * @param city2 Second city
 * @param country2 Second country
 * @returns Distance in kilometers
 */
export function calculateDistance(
  city1: string,
  country1: string,
  city2: string,
  country2: string
): number {
  const coords1 = getMockCoordinates(city1, country1);
  const coords2 = getMockCoordinates(city2, country2);
  
  return calculateHaversineDistance(
    coords1.lat,
    coords1.lng,
    coords2.lat,
    coords2.lng
  );
}

/**
 * Check if a location is within a certain radius of another location
 * @param city1 Center city
 * @param country1 Center country
 * @param city2 Target city
 * @param country2 Target country
 * @param radius Radius in kilometers
 * @returns boolean
 */
export function isWithinRadius(
  city1: string,
  country1: string,
  city2: string,
  country2: string,
  radius: number
): boolean {
  const distance = calculateDistance(city1, country1, city2, country2);
  return distance <= radius;
}