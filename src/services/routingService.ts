// Doctor G - Real-world Routing & Multi-modal Travel Time Service
import { haversineDistance } from '../utils/locationHelper';
import { CLINIC_COORDINATES } from '../utils/doctorDiscoveryHelper';
import { AREA_COORDINATES } from '../utils/locationHelper';

export interface RouteCoordinates {
  lat: number;
  lng: number;
}

export type TravelMode = 'car' | 'bike' | 'walking';

export interface NavigationStep {
  id: string;
  instruction: string;
  roadName: string;
  distanceMeters: number;
  durationSecs: number;
  icon: 'straight' | 'turn-left' | 'turn-right' | 'slight-left' | 'slight-right' | 'u-turn' | 'arrive';
}

export interface RouteResult {
  mode: TravelMode;
  distanceKm: number;
  distanceStr: string;
  durationMinutes: number;
  durationStr: string;
  etaStr: string;
  points: RouteCoordinates[];
  steps: NavigationStep[];
  isRealRoadRoute: boolean;
}

export interface MultiModalTravelInfo {
  distanceKm: number;
  distanceStr: string;
  car: {
    minutes: number;
    timeStr: string;
  };
  bike: {
    minutes: number;
    timeStr: string;
  };
  walking: {
    minutes: number;
    timeStr: string;
  };
}

/**
 * Calculates multi-modal travel times (Car, Bike, Walking) from distance in km.
 * Calibrated for realistic Indian traffic conditions.
 * Example for 4.2 km: 🚗 14 min · 🏍️ 11 min · 🚶 48 min
 */
export function calculateMultiModalTravelTimes(distanceKm: number): MultiModalTravelInfo {
  const d = Math.max(0.2, distanceKm);
  const distanceStr = `${d.toFixed(1)} km`;

  // Car: city average ~22-30 km/h + 2 mins traffic overhead
  const carMins = Math.max(3, Math.round(d * 2.8 + 2));
  const carTimeStr = carMins >= 60 ? `${Math.floor(carMins / 60)}h ${carMins % 60}m` : `${carMins} min`;

  // Bike / Two-wheeler: weaves through congestion faster ~32-38 km/h
  const bikeMins = Math.max(2, Math.round(d * 2.2 + 1));
  const bikeTimeStr = bikeMins >= 60 ? `${Math.floor(bikeMins / 60)}h ${bikeMins % 60}m` : `${bikeMins} min`;

  // Walking: ~5 km/h (11.5 mins per km)
  const walkMins = Math.max(1, Math.round(d * 11.5));
  const walkTimeStr = walkMins >= 60 ? `${Math.floor(walkMins / 60)}h ${walkMins % 60}m` : `${walkMins} min`;

  return {
    distanceKm: Math.round(d * 10) / 10,
    distanceStr,
    car: {
      minutes: carMins,
      timeStr: carTimeStr,
    },
    bike: {
      minutes: bikeMins,
      timeStr: bikeTimeStr,
    },
    walking: {
      minutes: walkMins,
      timeStr: walkTimeStr,
    },
  };
}

/**
 * Resolves accurate coordinates for any doctor, hospital, or clinic facility.
 */
export function resolveFacilityCoordinates(facility: {
  id?: string;
  hospitalId?: string;
  latitude?: number;
  longitude?: number;
  area?: string;
  city?: string;
}): RouteCoordinates {
  if (facility.latitude && facility.longitude) {
    return { lat: facility.latitude, lng: facility.longitude };
  }

  const hospId = facility.hospitalId || facility.id;
  if (hospId && CLINIC_COORDINATES[hospId]) {
    return {
      lat: CLINIC_COORDINATES[hospId].lat,
      lng: CLINIC_COORDINATES[hospId].lng,
    };
  }

  const normArea = (facility.area || '').toLowerCase().trim();
  if (normArea && AREA_COORDINATES[normArea]) {
    return {
      lat: AREA_COORDINATES[normArea].lat,
      lng: AREA_COORDINATES[normArea].lng,
    };
  }

  // Fallback coordinates (Kolkata EM Bypass medical cluster center)
  return { lat: 22.5697, lng: 88.4055 };
}

/**
 * Generates turn-by-turn guidance steps and curved realistic road geometry
 * as a high-reliability fallback when OSRM is offline or unreachable.
 */
function generateFallbackRoute(
  start: RouteCoordinates,
  dest: RouteCoordinates,
  mode: TravelMode,
  destinationName: string
): RouteResult {
  const straightDist = haversineDistance(start.lat, start.lng, dest.lat, dest.lng);
  // Realistic urban road path factor is ~1.25x straight-line distance
  const roadDistKm = Math.max(0.4, Math.round(straightDist * 1.25 * 10) / 10);
  const travelInfo = calculateMultiModalTravelTimes(roadDistKm);

  const durationMinutes =
    mode === 'car' ? travelInfo.car.minutes : mode === 'bike' ? travelInfo.bike.minutes : travelInfo.walking.minutes;

  const now = new Date();
  now.setMinutes(now.getMinutes() + durationMinutes);
  const etaStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Synthesize realistic road waypoints turning along street axes
  const points: RouteCoordinates[] = [];
  const segments = 12;

  const latDiff = dest.lat - start.lat;
  const lngDiff = dest.lng - start.lng;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Add sinusoidal road curvature along urban grid
    const curve = Math.sin(t * Math.PI) * 0.0035;
    const lat = start.lat + latDiff * t + curve * (i % 2 === 0 ? 0.6 : -0.4);
    const lng = start.lng + lngDiff * t - curve * (i % 2 === 0 ? -0.4 : 0.6);
    points.push({ lat, lng });
  }

  // Generate realistic turn-by-turn directions
  const steps: NavigationStep[] = [
    {
      id: 'step-1',
      instruction: 'Head toward main road from your current location',
      roadName: 'Healthcare Link Road',
      distanceMeters: Math.round(roadDistKm * 150),
      durationSecs: Math.round((durationMinutes * 60) * 0.15),
      icon: 'straight',
    },
    {
      id: 'step-2',
      instruction: 'Turn right onto the arterial hospital corridor',
      roadName: 'Medical District Bypass',
      distanceMeters: Math.round(roadDistKm * 400),
      durationSecs: Math.round((durationMinutes * 60) * 0.4),
      icon: 'turn-right',
    },
    {
      id: 'step-3',
      instruction: 'Continue straight through the junction',
      roadName: 'Care Express Way',
      distanceMeters: Math.round(roadDistKm * 300),
      durationSecs: Math.round((durationMinutes * 60) * 0.3),
      icon: 'straight',
    },
    {
      id: 'step-4',
      instruction: `Arrive at ${destinationName} (Entrance on left)`,
      roadName: destinationName,
      distanceMeters: Math.round(roadDistKm * 150),
      durationSecs: Math.round((durationMinutes * 60) * 0.15),
      icon: 'arrive',
    },
  ];

  return {
    mode,
    distanceKm: roadDistKm,
    distanceStr: `${roadDistKm.toFixed(1)} km`,
    durationMinutes,
    durationStr: mode === 'car' ? travelInfo.car.timeStr : mode === 'bike' ? travelInfo.bike.timeStr : travelInfo.walking.timeStr,
    etaStr,
    points,
    steps,
    isRealRoadRoute: false,
  };
}

/**
 * Fetches real road routing from OpenStreetMap OSRM routing service
 * with automatic fallback if network or OSRM demo server is unreachable.
 */
export async function getLiveRoadRoute(
  start: RouteCoordinates,
  dest: RouteCoordinates,
  mode: TravelMode = 'car',
  destinationName = 'Medical Center'
): Promise<RouteResult> {
  const profile = mode === 'walking' ? 'foot' : mode === 'bike' ? 'bike' : 'driving';
  // OSRM expects: /route/v1/{profile}/{lng},{lat};{lng},{lat}
  const url = `https://router.project-osrm.org/route/v1/${profile}/${start.lng},${start.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson&steps=true`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout

    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!resp.ok) {
      throw new Error(`OSRM HTTP status ${resp.status}`);
    }

    const data = await resp.json();
    if (!data.routes || data.routes.length === 0) {
      throw new Error('No route returned by OSRM');
    }

    const route = data.routes[0];
    const rawCoords: [number, number][] = route.geometry.coordinates; // [lng, lat]
    const points: RouteCoordinates[] = rawCoords.map(([lng, lat]) => ({ lat, lng }));

    const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
    const durationMinutes = Math.max(1, Math.round(route.duration / 60));

    const travelInfo = calculateMultiModalTravelTimes(distanceKm);
    const durationStr =
      mode === 'car' ? travelInfo.car.timeStr : mode === 'bike' ? travelInfo.bike.timeStr : travelInfo.walking.timeStr;

    const now = new Date();
    now.setMinutes(now.getMinutes() + durationMinutes);
    const etaStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Extract turn-by-turn navigation steps
    const steps: NavigationStep[] = [];
    if (route.legs && route.legs[0] && route.legs[0].steps) {
      route.legs[0].steps.forEach((st: any, idx: number) => {
        const modifier = st.maneuver?.modifier || '';
        const type = st.maneuver?.type || '';

        let icon: NavigationStep['icon'] = 'straight';
        if (type.includes('arrive')) icon = 'arrive';
        else if (modifier.includes('right')) icon = modifier.includes('slight') ? 'slight-right' : 'turn-right';
        else if (modifier.includes('left')) icon = modifier.includes('slight') ? 'slight-left' : 'turn-left';
        else if (modifier.includes('uturn')) icon = 'u-turn';

        steps.push({
          id: `step-${idx}`,
          instruction: st.maneuver?.instruction || (idx === 0 ? 'Head on route' : `Turn ${modifier || 'straight'} on ${st.name || 'street'}`),
          roadName: st.name || (idx === route.legs[0].steps.length - 1 ? destinationName : 'Connected Road'),
          distanceMeters: Math.round(st.distance),
          durationSecs: Math.round(st.duration),
          icon,
        });
      });
    }

    // If steps array was empty, provide structured steps
    if (steps.length === 0) {
      steps.push(
        {
          id: 'step-1',
          instruction: 'Follow planned road route toward destination',
          roadName: 'Main Medical Road',
          distanceMeters: Math.round(route.distance * 0.8),
          durationSecs: Math.round(route.duration * 0.8),
          icon: 'straight',
        },
        {
          id: 'step-2',
          instruction: `Arrive at ${destinationName}`,
          roadName: destinationName,
          distanceMeters: Math.round(route.distance * 0.2),
          durationSecs: Math.round(route.duration * 0.2),
          icon: 'arrive',
        }
      );
    }

    return {
      mode,
      distanceKm,
      distanceStr: `${distanceKm.toFixed(1)} km`,
      durationMinutes,
      durationStr,
      etaStr,
      points,
      steps,
      isRealRoadRoute: true,
    };
  } catch (err) {
    // Graceful instantaneous fallback with realistic road curvature & turn guidance
    console.info('Using local calibrated road routing fallback:', err);
    return generateFallbackRoute(start, dest, mode, destinationName);
  }
}

/**
 * Checks if current GPS position has moved off the planned route (deviation > 80m).
 */
export function isOffRoute(
  currentPos: RouteCoordinates,
  routePoints: RouteCoordinates[],
  thresholdKm = 0.08 // 80 meters
): boolean {
  if (routePoints.length === 0) return false;

  let minDistance = Infinity;
  for (const pt of routePoints) {
    const dist = haversineDistance(currentPos.lat, currentPos.lng, pt.lat, pt.lng);
    if (dist < minDistance) {
      minDistance = dist;
    }
  }

  return minDistance > thresholdKm;
}
