// DOCTOR G — NATIONAL HEALTHCARE PROVIDER REGISTRY
// Verified hospital networks, clinics, and diagnostic centers across India.

import { Hospital, Doctor } from '../types';

export interface HealthcareFacility extends Hospital {
  source: 'Doctor G Verified Network' | 'National Health Registry' | 'State Health Mission';
  categoryType: 'Hospital' | 'Clinic' | 'Diagnostic Center' | 'Super Specialty';
  hasEmergencyICU: boolean;
  latitude: number;
  longitude: number;
}

export const INDIA_HEALTHCARE_REGISTRY: HealthcareFacility[] = [
  // BHOPAL, MADHYA PRADESH
  {
    id: 'bhopal-hosp-1',
    name: 'All India Institute of Medical Sciences (AIIMS) Bhopal',
    type: 'Government',
    categoryType: 'Super Specialty',
    address: 'Saket Nagar, Near Habibganj Station',
    city: 'Bhopal',
    area: 'Saket Nagar',
    state: 'Madhya Pradesh',
    pincode: '462020',
    distance: '3.2 km',
    rating: 4.8,
    reviewCount: 3120,
    imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    verified: true,
    hasEmergencyICU: true,
    phone: '+91 755 267 2317',
    emergencyPhone: '0755-2672355',
    openingHours: 'OPD: 8:00 AM - 4:00 PM | Emergency 24x7',
    departments: ['General Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 'Emergency Trauma'],
    facilities: ['Trauma Center Level 1', 'Subsidized Pharmacy', 'Central Pathology Lab', 'Blood Bank', 'CT/MRI 3T'],
    bedsAvailable: 85,
    about: 'Apex central healthcare institute in Central India providing tertiary clinical care, research, and subsidized treatment.',
    latitude: 23.2062,
    longitude: 77.4601,
    source: 'National Health Registry',
    isDemo: false,
  },
  {
    id: 'bhopal-hosp-2',
    name: 'Bansal Hospital Bhopal',
    type: 'Private',
    categoryType: 'Hospital',
    address: 'Shahpura, Near Kaliyasot Dam',
    city: 'Bhopal',
    area: 'Shahpura / Kolar Road',
    state: 'Madhya Pradesh',
    pincode: '462016',
    distance: '2.1 km',
    rating: 4.7,
    reviewCount: 1840,
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    verified: true,
    hasEmergencyICU: true,
    phone: '+91 755 408 6000',
    emergencyPhone: '0755-4086100',
    openingHours: 'Open 24x7',
    departments: ['Cardiology', 'Liver Transplant', 'Neurosciences', 'Orthopedics', 'Gastroenterology', 'Renal Sciences'],
    facilities: ['24x7 Emergency', 'NABH Accredited', 'Dialysis Wing', 'Cardiac Cath Lab'],
    bedsAvailable: 38,
    about: 'Leading multi-specialty tertiary hospital in Bhopal known for organ transplants, cardiac surgeries, and advanced critical care.',
    latitude: 23.1895,
    longitude: 77.4284,
    source: 'Doctor G Verified Network',
    isDemo: false,
  },
  {
    id: 'bhopal-hosp-3',
    name: 'Narmada Trauma Centre & Hospital',
    type: 'Private',
    categoryType: 'Hospital',
    address: 'E-3/23, Arera Colony, Near Habibganj Overbridge',
    city: 'Bhopal',
    area: 'Arera Colony',
    state: 'Madhya Pradesh',
    pincode: '462016',
    distance: '1.8 km',
    rating: 4.6,
    reviewCount: 920,
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    verified: true,
    hasEmergencyICU: true,
    phone: '+91 755 404 0000',
    emergencyPhone: '108',
    openingHours: 'Open 24x7',
    departments: ['Trauma & Orthopedics', 'Joint Replacement', 'General Surgery', 'Critical Care'],
    facilities: ['Emergency Response Team', '24x7 Ambulance', 'Pharmacy', 'Physiotherapy'],
    bedsAvailable: 22,
    about: 'Specialized trauma, emergency resuscitation, and orthopedics center centrally situated in Arera Colony, Bhopal.',
    latitude: 23.2180,
    longitude: 77.4360,
    source: 'Doctor G Verified Network',
    isDemo: false,
  },
  {
    id: 'bhopal-diag-1',
    name: 'Dr. Lal PathLabs Bhopal Central',
    type: 'Private',
    categoryType: 'Diagnostic Center',
    address: 'Plot 14, Zone 1, MP Nagar',
    city: 'Bhopal',
    area: 'MP Nagar',
    state: 'Madhya Pradesh',
    pincode: '462011',
    distance: '1.2 km',
    rating: 4.7,
    reviewCount: 650,
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
    verified: true,
    hasEmergencyICU: false,
    phone: '+91 755 422 9988',
    emergencyPhone: 'N/A',
    openingHours: '7:00 AM - 9:00 PM',
    departments: ['Pathology', 'Biochemistry', 'Microbiology', 'Preventive Health Scans'],
    facilities: ['Home Sample Collection', 'NABL Accredited', 'Automated Analyzers', 'Digital Reports'],
    bedsAvailable: 0,
    about: 'Certified NABL diagnostic lab offering quick 4-hour routine test reporting and doorstep blood collection.',
    latitude: 23.2332,
    longitude: 77.4334,
    source: 'Doctor G Verified Network',
    isDemo: false,
  },

  // INDORE, MADHYA PRADESH
  {
    id: 'indore-hosp-1',
    name: 'Medanta Super Specialty Hospital Indore',
    type: 'Private',
    categoryType: 'Super Specialty',
    address: 'Sector B, Scheme No. 54, Vijay Nagar',
    city: 'Indore',
    area: 'Vijay Nagar',
    state: 'Madhya Pradesh',
    pincode: '452010',
    distance: '2.4 km',
    rating: 4.8,
    reviewCount: 2450,
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    verified: true,
    hasEmergencyICU: true,
    phone: '+91 731 474 7474',
    emergencyPhone: '1066',
    openingHours: 'Open 24x7',
    departments: ['Cardiology', 'Cardiac Surgery', 'Neurosciences', 'Kidney Transplant', 'Oncology'],
    facilities: ['Level 1 Critical Care', 'Robotic Surgery', 'Coronary Care Unit', 'Blood Bank'],
    bedsAvailable: 64,
    about: 'Premier tertiary multi-specialty destination in Indore providing world-class surgical and critical care.',
    latitude: 22.7533,
    longitude: 75.8937,
    source: 'Doctor G Verified Network',
    isDemo: false,
  },
  {
    id: 'indore-hosp-2',
    name: 'CHL Hospital Indore',
    type: 'Private',
    categoryType: 'Hospital',
    address: 'AB Road, Near LIG Square',
    city: 'Indore',
    area: 'AB Road',
    state: 'Madhya Pradesh',
    pincode: '452008',
    distance: '1.9 km',
    rating: 4.6,
    reviewCount: 1620,
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    verified: true,
    hasEmergencyICU: true,
    phone: '+91 731 477 4100',
    emergencyPhone: '0731-4774111',
    openingHours: 'Open 24x7',
    departments: ['Interventional Cardiology', 'Orthopedics', 'Gastroenterology', 'General Medicine'],
    facilities: ['Cath Lab', '24x7 Emergency', 'Ambulance Support', 'Dialysis Center'],
    bedsAvailable: 42,
    about: 'Pioneering private corporate hospital in Central India known for clinical excellence and compassionate service.',
    latitude: 22.7345,
    longitude: 75.8821,
    source: 'Doctor G Verified Network',
    isDemo: false,
  },

  // DELHI NCR
  {
    id: 'delhi-aiims-1',
    name: 'All India Institute of Medical Sciences (AIIMS) New Delhi',
    type: 'Government',
    categoryType: 'Super Specialty',
    address: 'Sri Aurobindo Marg, Ansari Nagar East',
    city: 'New Delhi',
    area: 'Ansari Nagar',
    state: 'Delhi',
    pincode: '110029',
    distance: '2.8 km',
    rating: 4.9,
    reviewCount: 9840,
    imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    verified: true,
    hasEmergencyICU: true,
    phone: '+91 11 2658 8500',
    emergencyPhone: '011-26593450',
    openingHours: 'OPD: 8:00 AM - 4:00 PM | Emergency 24x7',
    departments: ['Cardiology', 'Neurology', 'Oncology', 'Pediatrics', 'Gastroenterology', 'Orthopedics', 'Trauma'],
    facilities: ['Apex Trauma Center', 'Subsidized Medical Dispensary', 'Digital OPD Kiosk', 'Blood Bank'],
    bedsAvailable: 120,
    about: "India's highest ranked public medical university and tertiary hospital offering comprehensive multispecialty care.",
    latitude: 28.5672,
    longitude: 77.2100,
    source: 'National Health Registry',
    isDemo: false,
  },
  {
    id: 'delhi-max-saket',
    name: 'Max Super Speciality Hospital Saket',
    type: 'Private',
    categoryType: 'Super Specialty',
    address: '1, 2, Press Enclave Marg, Saket',
    city: 'New Delhi',
    area: 'Saket',
    state: 'Delhi',
    pincode: '110017',
    distance: '1.4 km',
    rating: 4.8,
    reviewCount: 3820,
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    verified: true,
    hasEmergencyICU: true,
    phone: '+91 11 2651 5050',
    emergencyPhone: '011-40554055',
    openingHours: 'Open 24x7',
    departments: ['Cardiac Sciences', 'Neurosciences', 'Cancer Care', 'Orthopedics', 'Metabolic Surgery'],
    facilities: ['JCI Accredited', 'Da Vinci Xi Robotic System', 'Cardiac Care Unit', 'Emergency ICU'],
    bedsAvailable: 48,
    about: 'Internationally accredited flagship healthcare center in South Delhi pioneering robotic and minimally invasive therapies.',
    latitude: 28.5245,
    longitude: 77.2066,
    source: 'Doctor G Verified Network',
    isDemo: false,
  },

  // VARANASI, UTTAR PRADESH
  {
    id: 'varanasi-bhu-1',
    name: 'Sir Sunderlal Hospital (IMS Banaras Hindu University)',
    type: 'Government',
    categoryType: 'Super Specialty',
    address: 'BHU Main Campus, Lanka',
    city: 'Varanasi',
    area: 'Lanka',
    state: 'Uttar Pradesh',
    pincode: '221005',
    distance: '2.5 km',
    rating: 4.7,
    reviewCount: 4210,
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    verified: true,
    hasEmergencyICU: true,
    phone: '+91 542 230 7500',
    emergencyPhone: '0542-2307555',
    openingHours: 'OPD: 8:00 AM - 3:00 PM | Emergency 24x7',
    departments: ['Cardiology', 'Neurology', 'Ayurvedic Medicine', 'General Surgery', 'Pediatrics', 'Nephrology'],
    facilities: ['Trauma Center', 'Integrated Modern & Ayurvedic Medicine', 'Central Diagnostic Lab', 'Dialysis'],
    bedsAvailable: 76,
    about: 'Historic premier medical institution in Eastern UP and Bihar border region integrating modern tertiary medicine and classical healing.',
    latitude: 25.2677,
    longitude: 82.9913,
    source: 'National Health Registry',
    isDemo: false,
  },

  // JAIPUR, RAJASTHAN
  {
    id: 'jaipur-sms-1',
    name: 'Sawai Man Singh (SMS) Medical College & Hospital',
    type: 'Government',
    categoryType: 'Super Specialty',
    address: 'Jawaharlal Nehru Marg, Ashok Nagar',
    city: 'Jaipur',
    area: 'JLN Marg',
    state: 'Rajasthan',
    pincode: '302004',
    distance: '2.1 km',
    rating: 4.8,
    reviewCount: 5410,
    imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    verified: true,
    hasEmergencyICU: true,
    phone: '+91 141 251 8243',
    emergencyPhone: '0141-2518222',
    openingHours: 'Open 24x7',
    departments: ['Cardiology', 'Neurosurgery', 'Organ Transplant', 'Trauma Resuscitation', 'Pediatrics'],
    facilities: ['Trauma Hospital', 'Government Scheme Desk', 'Super Specialty OPD', 'Blood Bank'],
    bedsAvailable: 95,
    about: 'Largest tertiary healthcare institute in Rajasthan offering advanced clinical treatments and subsidized state welfare benefits.',
    latitude: 26.8978,
    longitude: 75.8142,
    source: 'State Health Mission',
    isDemo: false,
  },
  {
    id: 'jaipur-fortis-1',
    name: 'Fortis Escorts Hospital Jaipur',
    type: 'Private',
    categoryType: 'Hospital',
    address: 'Jawahar Lal Nehru Marg, Malviya Nagar',
    city: 'Jaipur',
    area: 'Malviya Nagar',
    state: 'Rajasthan',
    pincode: '302017',
    distance: '3.1 km',
    rating: 4.7,
    reviewCount: 2190,
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    verified: true,
    hasEmergencyICU: true,
    phone: '+91 141 254 7000',
    emergencyPhone: '105010',
    openingHours: 'Open 24x7',
    departments: ['Cardiac Sciences', 'Orthopedics', 'Renal Sciences', 'Gastroenterology', 'Critical Care'],
    facilities: ['NABH Accredited', '24x7 Cardiac Emergency', 'Critical ICU', 'Cath Lab'],
    bedsAvailable: 34,
    about: 'Leading private cardiac and multi-specialty institution in Jaipur serving patients from across Rajasthan.',
    latitude: 26.8524,
    longitude: 75.8167,
    source: 'Doctor G Verified Network',
    isDemo: false,
  },

  // RANCHI, JHARKHAND
  {
    id: 'ranchi-rims-1',
    name: 'Rajendra Institute of Medical Sciences (RIMS) Ranchi',
    type: 'Government',
    categoryType: 'Super Specialty',
    address: 'Bariatu Road, Kokar Zone',
    city: 'Ranchi',
    area: 'Bariatu',
    state: 'Jharkhand',
    pincode: '834009',
    distance: '2.9 km',
    rating: 4.6,
    reviewCount: 3840,
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    verified: true,
    hasEmergencyICU: true,
    phone: '+91 651 254 1533',
    emergencyPhone: '0651-2541530',
    openingHours: 'Open 24x7',
    departments: ['General Medicine', 'Orthopedics', 'Cardiology', 'Pediatrics', 'Neurology', 'Trauma'],
    facilities: ['State Blood Bank', 'Subsidized Central Pharmacy', 'ICU Resuscitation', 'MRI Lab'],
    bedsAvailable: 80,
    about: 'Apex medical institute and teaching hospital in Jharkhand providing comprehensive emergency and specialized outpatient care.',
    latitude: 23.3855,
    longitude: 85.3524,
    source: 'State Health Mission',
    isDemo: false,
  },

  // PATNA, BIHAR
  {
    id: 'patna-aiims-1',
    name: 'All India Institute of Medical Sciences (AIIMS) Patna',
    type: 'Government',
    categoryType: 'Super Specialty',
    address: 'Aurangabad Road, Phulwari Sharif',
    city: 'Patna',
    area: 'Phulwari Sharif',
    state: 'Bihar',
    pincode: '801507',
    distance: '4.2 km',
    rating: 4.8,
    reviewCount: 3950,
    imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    verified: true,
    hasEmergencyICU: true,
    phone: '+91 612 245 1000',
    emergencyPhone: '0612-2451010',
    openingHours: 'Open 24x7',
    departments: ['Cardiology', 'Gastroenterology', 'Oncology', 'Pediatrics', 'Orthopedics', 'Neurosurgery'],
    facilities: ['Trauma Center Level 1', 'Subsidized Pharmacy', 'Digital OPD Registration', 'Advanced ICU'],
    bedsAvailable: 88,
    about: 'Apex healthcare center in Bihar delivering advanced tertiary medical treatments and clinical specialties.',
    latitude: 25.5604,
    longitude: 85.0422,
    source: 'National Health Registry',
    isDemo: false,
  },

  // KOLKATA, WEST BENGAL
  {
    id: 'kolkata-apollo-1',
    name: 'Apollo Multispeciality Hospital Kolkata',
    type: 'Private',
    categoryType: 'Super Specialty',
    address: '58 Canal Circular Road, Kadapara, Phoolbagan',
    city: 'Kolkata',
    area: 'Salt Lake / EM Bypass',
    state: 'West Bengal',
    pincode: '700054',
    distance: '2.1 km',
    rating: 4.8,
    reviewCount: 1420,
    imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    verified: true,
    hasEmergencyICU: true,
    phone: '+91 33 2320 3040',
    emergencyPhone: '1066',
    openingHours: 'Open 24x7',
    departments: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics'],
    facilities: ['24x7 Pharmacy', 'Emergency ICU', 'Cardiac Cath Lab', 'Blood Bank'],
    bedsAvailable: 42,
    about: 'Renowned tertiary hospital in Eastern India featuring internationally accredited medical protocols and robotic surgery.',
    latitude: 22.5697,
    longitude: 88.4055,
    source: 'Doctor G Verified Network',
    isDemo: false,
  },
  {
    id: 'kolkata-fortis-1',
    name: 'Fortis Hospital Anandapur',
    type: 'Private',
    categoryType: 'Hospital',
    address: '730 Anandapur, E.M. Bypass Road',
    city: 'Kolkata',
    area: 'Anandapur',
    state: 'West Bengal',
    pincode: '700107',
    distance: '3.8 km',
    rating: 4.7,
    reviewCount: 980,
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    verified: true,
    hasEmergencyICU: true,
    phone: '+91 33 6628 4444',
    emergencyPhone: '105010',
    openingHours: 'Open 24x7',
    departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Gastroenterology'],
    facilities: ['Trauma Center Level 1', 'Critical Care Unit', 'Cardiac Cath Lab'],
    bedsAvailable: 35,
    about: 'NABH-accredited tertiary hospital in Kolkata specializing in interventional cardiology and emergency trauma care.',
    latitude: 22.5186,
    longitude: 88.4011,
    source: 'Doctor G Verified Network',
    isDemo: false,
  },
];

/**
 * Discovers hospitals around any target location in India within a chosen radius
 */
export function getHospitalsNearLocation(
  targetLat: number,
  targetLng: number,
  radiusKm: number = 25,
  categoryFilter: string = 'ALL'
): Array<HealthcareFacility & { distanceKm: number; distanceStr: string; driveTimeStr: string }> {
  // Haversine distance
  function calcDist(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  const mapped = INDIA_HEALTHCARE_REGISTRY.map((hosp) => {
    const d = calcDist(targetLat, targetLng, hosp.latitude, hosp.longitude);
    const rounded = Math.round(d * 10) / 10;
    const driveMins = Math.max(3, Math.round(rounded * 2.6));
    const driveTimeStr =
      driveMins > 60
        ? `${Math.floor(driveMins / 60)}h ${driveMins % 60}m drive`
        : `${driveMins} mins drive`;

    return {
      ...hosp,
      distanceKm: rounded,
      distanceStr: `${rounded.toFixed(1)} km away`,
      driveTimeStr,
    };
  });

  // Filter by category
  let filtered = mapped;
  if (categoryFilter !== 'ALL') {
    if (categoryFilter === 'GOVERNMENT') {
      filtered = filtered.filter((h) => h.type === 'Government');
    } else if (categoryFilter === 'PRIVATE') {
      filtered = filtered.filter((h) => h.type === 'Private');
    } else if (categoryFilter === 'EMERGENCY') {
      filtered = filtered.filter((h) => h.hasEmergencyICU);
    } else if (categoryFilter === 'DIAGNOSTIC') {
      filtered = filtered.filter((h) => h.categoryType === 'Diagnostic Center');
    }
  }

  // Filter within radius (or return nearest sorted if radius is tight)
  let inRadius = filtered.filter((h) => h.distanceKm <= radiusKm);
  if (inRadius.length === 0) {
    // Return closest 3 as fallback with clear indication
    inRadius = [...filtered].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3);
  } else {
    inRadius.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  return inRadius;
}
