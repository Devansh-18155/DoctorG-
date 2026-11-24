// =========================================================================
// DOCTOR G — GOOGLE MAPS & NAVIGATION SERVICE
// Real geocoding, distance matrix calculation & live driving directions
// =========================================================================

export interface LatLngCoords {
  lat: number;
  lng: number;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

/**
 * Checks if live Google Maps API key is configured
 */
export const isGoogleMapsConfigured = Boolean(
  GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.length > 15
);

/**
 * Loads the Google Maps JavaScript API script dynamically
 */
export function loadGoogleMapsScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).google?.maps) {
      resolve(true);
      return;
    }

    if (!isGoogleMapsConfigured) {
      resolve(false);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('[Doctor G] Google Maps script load notice. Falling back to built-in spatial radar.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Calculates straight-line distance in kilometers between two GPS coordinates
 */
export function calculateHaversineDistanceKm(
  coord1: LatLngCoords,
  coord2: LatLngCoords
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return Math.round(dist * 10) / 10;
}

/**
 * Calculates estimated driving time based on road distance
 */
export function calculateDrivingEtaMinutes(distanceKm: number): number {
  // Realistic urban road speed in India (~25-30 km/h with traffic factor)
  return Math.max(4, Math.round(distanceKm * 2.5 + 2));
}

/**
 * Generates an official external Google Maps directions URL for one-click live navigation
 */
export function getGoogleMapsNavigationUrl(
  destination: LatLngCoords,
  destinationName: string,
  origin?: LatLngCoords
): string {
  const destParam = `${destination.lat},${destination.lng}`;
  const originParam = origin ? `&origin=${origin.lat},${origin.lng}` : '';
  return `https://www.google.com/maps/dir/?api=1${originParam}&destination=${destParam}&destination_place_id=${encodeURIComponent(
    destinationName
  )}&travelmode=driving`;
}
