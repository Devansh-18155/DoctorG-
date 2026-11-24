import { Doctor, Hospital } from '../types';
import { DOCTORS, HOSPITALS } from '../data/mockData';
import { CITIES_DATA, CityInfo } from '../data/cityData';
import { haversineDistance } from './locationHelper';

export interface EnrichedDoctor extends Doctor {
  fullClinicAddress: string;
  clinicCity: string;
  clinicArea: string;
  clinicState: string;
  clinicPincode: string;
  lat: number;
  lng: number;
  openingHoursStr: string;
  distanceKm?: number;
  distanceStr?: string;
  driveTimeStr?: string;
  walkTimeStr?: string;
}

// Known exact coordinates for medical centers and clinic buildings
export const CLINIC_COORDINATES: Record<string, { lat: number; lng: number; state: string; pincode: string }> = {
  'hosp-1': { lat: 22.5697, lng: 88.4055, state: 'West Bengal', pincode: '700054' },
  'hosp-2': { lat: 22.5186, lng: 88.4011, state: 'West Bengal', pincode: '700107' },
  'hosp-3': { lat: 22.981, lng: 88.439, state: 'West Bengal', pincode: '741235' },
  'hosp-4': { lat: 22.5802, lng: 88.4357, state: 'West Bengal', pincode: '700091' },
  'hosp-5': { lat: 22.5284, lng: 88.3308, state: 'West Bengal', pincode: '700027' },
  'hosp-6': { lat: 28.4395, lng: 77.0428, state: 'Delhi', pincode: '122001' },
  'hosp-7': { lat: 28.5603, lng: 77.2842, state: 'Delhi', pincode: '110025' },
  'hosp-8': { lat: 19.0514, lng: 72.829, state: 'Maharashtra', pincode: '400050' },
  'hosp-9': { lat: 19.1315, lng: 72.8252, state: 'Maharashtra', pincode: '400053' },
  'hosp-10': { lat: 12.9592, lng: 77.6534, state: 'Karnataka', pincode: '560008' },
  'hosp-11': { lat: 17.4262, lng: 78.4116, state: 'Telangana', pincode: '500033' },
  'hosp-12': { lat: 13.0569, lng: 80.2525, state: 'Tamil Nadu', pincode: '600006' },
  'hosp-13': { lat: 22.5855, lng: 88.4632, state: 'West Bengal', pincode: '700156' },
  'hosp-14': { lat: 12.9881, lng: 77.5963, state: 'Karnataka', pincode: '560052' },
  'hosp-15': { lat: 17.4173, lng: 78.4482, state: 'Telangana', pincode: '500034' },
  'hosp-16': { lat: 28.5273, lng: 77.2117, state: 'Delhi', pincode: '110017' },
  'hosp-17': { lat: 19.1672, lng: 72.9463, state: 'Maharashtra', pincode: '400080' },
  'hosp-18': { lat: 17.4419, lng: 78.4891, state: 'Telangana', pincode: '500003' },
  'hosp-19': { lat: 22.5135, lng: 88.4024, state: 'West Bengal', pincode: '700107' },
};

/**
 * Hydrates every Doctor with accurate real-world clinic geolocation coordinates,
 * address, and city info.
 */
export function getEnrichedDoctors(
  doctorsList: Doctor[] = DOCTORS,
  hospitalsList: Hospital[] = HOSPITALS,
  userLocation?: { lat: number; lng: number } | null
): EnrichedDoctor[] {
  const hospitalMap = new Map<string, Hospital>();
  hospitalsList.forEach((h) => hospitalMap.set(h.id, h));

  return doctorsList.map((doc) => {
    const hosp = hospitalMap.get(doc.hospitalId);
    const coordsInfo = CLINIC_COORDINATES[doc.hospitalId] || {
      lat: doc.latitude || 22.5726,
      lng: doc.longitude || 88.3639,
      state: 'West Bengal',
      pincode: '700091',
    };

    const lat = doc.latitude || coordsInfo.lat;
    const lng = doc.longitude || coordsInfo.lng;
    const clinicCity = doc.city || hosp?.city || 'Kolkata';
    const clinicArea = doc.area || hosp?.area || 'Central District';
    const clinicState = doc.state || hosp?.state || coordsInfo.state;
    const clinicPincode = doc.pincode || hosp?.pincode || coordsInfo.pincode;
    const fullClinicAddress =
      doc.clinicAddress ||
      `${hosp?.name || doc.hospitalName}, ${hosp?.address || clinicArea}, ${clinicCity} - ${clinicPincode}`;

    let distanceKm: number | undefined;
    let distanceStr: string | undefined;
    let driveTimeStr: string | undefined;
    let walkTimeStr: string | undefined;

    if (userLocation && userLocation.lat && userLocation.lng) {
      const d = haversineDistance(userLocation.lat, userLocation.lng, lat, lng);
      distanceKm = Math.round(d * 10) / 10;
      distanceStr = `${distanceKm.toFixed(1)} km`;
      const driveMins = Math.max(3, Math.round(distanceKm * 2.5));
      driveTimeStr = driveMins > 60 ? `${Math.floor(driveMins / 60)}h ${driveMins % 60}m drive` : `${driveMins} mins drive`;
      const walkMins = Math.round(distanceKm * 12);
      walkTimeStr = walkMins > 60 ? `${Math.floor(walkMins / 60)}h ${walkMins % 60}m walk` : `${walkMins} mins walk`;
    }

    return {
      ...doc,
      lat,
      lng,
      clinicCity,
      clinicArea,
      clinicState,
      clinicPincode,
      fullClinicAddress,
      openingHoursStr: doc.openingHours || hosp?.openingHours || '9:00 AM - 6:00 PM',
      distanceKm,
      distanceStr,
      driveTimeStr,
      walkTimeStr,
    };
  });
}

export interface DoctorFilterOptions {
  city?: string;
  searchQuery?: string;
  specialization?: string;
  hospitalId?: string;
  feeRange?: 'ALL' | 'UNDER_500' | '500_1000' | 'ABOVE_1000';
  minExperience?: number;
  availableToday?: boolean;
  hasSlotsAvailable?: boolean;
  maxDistanceKm?: number;
  sortBy?: 'RECOMMENDED' | 'NEAREST' | 'FEE_LOW' | 'EXPERIENCE' | 'EARLIEST_SLOT';
}

/**
 * Filters and sorts enriched doctors based on all user-specified criteria.
 */
export function filterAndSortDoctors(
  doctors: EnrichedDoctor[],
  filters: DoctorFilterOptions,
  userLocation?: { lat: number; lng: number } | null
): EnrichedDoctor[] {
  let result = [...doctors];

  // 1. City Filter (Case-insensitive)
  if (filters.city && filters.city.trim() !== '' && filters.city !== 'All Cities') {
    const qCity = filters.city.toLowerCase().trim();
    result = result.filter((d) => {
      const c = d.clinicCity.toLowerCase();
      return c.includes(qCity) || qCity.includes(c);
    });
  }

  // 2. Search Query (Doctor name, specialty, hospital name, clinic address, locality)
  if (filters.searchQuery && filters.searchQuery.trim() !== '') {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter((d) => {
      return (
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.hospitalName.toLowerCase().includes(q) ||
        d.clinicArea.toLowerCase().includes(q) ||
        d.fullClinicAddress.toLowerCase().includes(q) ||
        d.qualification.toLowerCase().includes(q)
      );
    });
  }

  // 3. Specialization
  if (filters.specialization && filters.specialization !== 'All Specializations') {
    const qSpec = filters.specialization.toLowerCase();
    result = result.filter(
      (d) =>
        d.specialty.toLowerCase().includes(qSpec) ||
        d.departmentId.toLowerCase().includes(qSpec)
    );
  }

  // 4. Hospital Filter
  if (filters.hospitalId && filters.hospitalId !== 'ALL') {
    result = result.filter((d) => d.hospitalId === filters.hospitalId);
  }

  // 5. Fee Range
  if (filters.feeRange && filters.feeRange !== 'ALL') {
    if (filters.feeRange === 'UNDER_500') {
      result = result.filter((d) => d.consultationFee <= 500);
    } else if (filters.feeRange === '500_1000') {
      result = result.filter((d) => d.consultationFee > 500 && d.consultationFee <= 1000);
    } else if (filters.feeRange === 'ABOVE_1000') {
      result = result.filter((d) => d.consultationFee > 1000);
    }
  }

  // 6. Experience
  if (filters.minExperience && filters.minExperience > 0) {
    result = result.filter((d) => d.experienceYears >= (filters.minExperience || 0));
  }

  // 7. Available Today
  if (filters.availableToday) {
    result = result.filter((d) => (d.nextSlot || '').toLowerCase().includes('today'));
  }

  // 8. Distance Radius Filter
  if (filters.maxDistanceKm && filters.maxDistanceKm > 0) {
    result = result.filter((d) => (d.distanceKm !== undefined ? d.distanceKm <= filters.maxDistanceKm! : true));
  }

  // 9. Sorting
  const sortBy = filters.sortBy || 'RECOMMENDED';
  result.sort((a, b) => {
    switch (sortBy) {
      case 'NEAREST':
        if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
          return a.distanceKm - b.distanceKm;
        }
        return b.rating - a.rating;
      case 'FEE_LOW':
        return a.consultationFee - b.consultationFee;
      case 'EXPERIENCE':
        return b.experienceYears - a.experienceYears;
      case 'EARLIEST_SLOT':
        const aToday = (a.nextSlot || '').toLowerCase().includes('today') ? 0 : 1;
        const bToday = (b.nextSlot || '').toLowerCase().includes('today') ? 0 : 1;
        if (aToday !== bToday) return aToday - bToday;
        return b.rating - a.rating;
      case 'RECOMMENDED':
      default:
        return b.rating * b.reviewCount - a.rating * a.reviewCount;
    }
  });

  return result;
}

/**
 * Generates realistic intermediate route waypoints connecting origin and destination coordinates
 */
export function generateRoutePoints(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  numWaypoints: number = 5
): Array<{ lat: number; lng: number; instruction?: string }> {
  const points: Array<{ lat: number; lng: number; instruction?: string }> = [];
  points.push({ lat: origin.lat, lng: origin.lng, instruction: 'Start from your location' });

  // Add realistic street turn waypoints with minor orthogonal jitter
  for (let i = 1; i <= numWaypoints; i++) {
    const ratio = i / (numWaypoints + 1);
    const midLat = origin.lat + (destination.lat - origin.lat) * ratio;
    const midLng = origin.lng + (destination.lng - origin.lng) * ratio;

    // Slight curvature simulating real roads
    const jitterLat = Math.sin(ratio * Math.PI) * 0.003 * (i % 2 === 0 ? 1 : -0.7);
    const jitterLng = Math.cos(ratio * Math.PI) * 0.003 * (i % 2 === 0 ? -0.8 : 1);

    const instructions = [
      'Head towards Main Arterial Road',
      'Continue straight past Medical Center Flyover',
      'Take slight right at Clinic Crossroad',
      'Turn left towards Hospital Emergency & OPD Gate',
      'Arrive at Doctor OPD Entrance',
    ];

    points.push({
      lat: midLat + jitterLat,
      lng: midLng + jitterLng,
      instruction: instructions[i - 1] || 'Continue on route',
    });
  }

  points.push({ lat: destination.lat, lng: destination.lng, instruction: 'Arrive at Clinic / OPD Room' });
  return points;
}

/**
 * Builds external Google Maps deep-link and browser fallback link
 */
export function buildGoogleMapsUrl(
  destination: { lat: number; lng: number; name?: string },
  origin?: { lat: number; lng: number } | null,
  mode: 'driving' | 'walking' = 'driving'
): { appUrl: string; webUrl: string } {
  const destStr = `${destination.lat},${destination.lng}`;
  const originStr = origin ? `${origin.lat},${origin.lng}` : '';

  // Google Maps universal web & app URL
  const webUrl = originStr
    ? `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destStr}&travelmode=${mode}`
    : `https://www.google.com/maps/dir/?api=1&destination=${destStr}&travelmode=${mode}`;

  // Deep link intent for mobile devices
  const appUrl = `https://maps.google.com/maps?daddr=${destStr}${originStr ? `&saddr=${originStr}` : ''}&directionsmode=${mode}`;

  return { appUrl, webUrl };
}
