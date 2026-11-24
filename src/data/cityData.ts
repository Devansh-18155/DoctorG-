export interface CityLocality {
  name: string;
  lat: number;
  lng: number;
  pincode: string;
}

export interface CityInfo {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  popular: boolean;
  pincodes: string[];
  localities: CityLocality[];
}

export const CITIES_DATA: CityInfo[] = [
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5726,
    lng: 88.3639,
    popular: true,
    pincodes: ['700091', '700156', '700027', '700019', '700016', '700034', '700107'],
    localities: [
      { name: 'Salt Lake (Sector I - V)', lat: 22.5867, lng: 88.4178, pincode: '700091' },
      { name: 'New Town (Action Area I - III)', lat: 22.5936, lng: 88.4732, pincode: '700156' },
      { name: 'Alipore (Hospital Hub)', lat: 22.5284, lng: 88.3308, pincode: '700027' },
      { name: 'Ballygunge', lat: 22.528, lng: 88.365, pincode: '700019' },
      { name: 'Park Street Medical Enclave', lat: 22.5516, lng: 88.3524, pincode: '700016' },
      { name: 'Anandapur (EM Bypass Hub)', lat: 22.5186, lng: 88.4011, pincode: '700107' },
      { name: 'Behala', lat: 22.4988, lng: 88.3129, pincode: '700034' },
      { name: 'Kalyani Central Hospital Zone', lat: 22.9751, lng: 88.4345, pincode: '741235' },
    ],
  },
  {
    id: 'delhi-ncr',
    name: 'Delhi NCR',
    state: 'Delhi',
    lat: 28.6139,
    lng: 77.209,
    popular: true,
    pincodes: ['110001', '110049', '110075', '122001', '201301', '110025'],
    localities: [
      { name: 'Connaught Place Central', lat: 28.6304, lng: 77.2177, pincode: '110001' },
      { name: 'South Extension (Medical Line)', lat: 28.5729, lng: 77.2217, pincode: '110049' },
      { name: 'Saket City Centre', lat: 28.5273, lng: 77.2117, pincode: '110017' },
      { name: 'Gurugram Sector 38 (Medanta Hub)', lat: 28.4395, lng: 77.0428, pincode: '122001' },
      { name: 'Noida Sector 62', lat: 28.628, lng: 77.3649, pincode: '201309' },
      { name: 'Dwarka Sector 12', lat: 28.5823, lng: 77.05, pincode: '110075' },
      { name: 'Okhla Escorts Enclave', lat: 28.5603, lng: 77.2842, pincode: '110025' },
    ],
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.076,
    lng: 72.8777,
    popular: true,
    pincodes: ['400050', '400053', '400076', '400005', '400014', '400080'],
    localities: [
      { name: 'Bandra West (Lilavati Enclave)', lat: 19.0514, lng: 72.829, pincode: '400050' },
      { name: 'Andheri West (Four Bungalows)', lat: 19.1315, lng: 72.8252, pincode: '400053' },
      { name: 'Powai Hiranandani', lat: 19.1176, lng: 72.906, pincode: '400076' },
      { name: 'Dadar Central', lat: 19.0178, lng: 72.8478, pincode: '400014' },
      { name: 'Mulund West (Fortis Zone)', lat: 19.1672, lng: 72.9463, pincode: '400080' },
      { name: 'Colaba & Fort', lat: 18.9067, lng: 72.8147, pincode: '400005' },
    ],
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    popular: true,
    pincodes: ['560008', '560034', '560066', '560102', '560011', '560052'],
    localities: [
      { name: 'Indiranagar HAL Airport Road', lat: 12.9592, lng: 77.6534, pincode: '560008' },
      { name: 'Koramangala 4th Block', lat: 12.9352, lng: 77.6245, pincode: '560034' },
      { name: 'Cunningham Road (Fortis Hub)', lat: 12.9881, lng: 77.5963, pincode: '560052' },
      { name: 'Whitefield ITPL Main Road', lat: 12.9698, lng: 77.75, pincode: '560066' },
      { name: 'HSR Layout Sector 1', lat: 12.9121, lng: 77.6446, pincode: '560102' },
      { name: 'Jayanagar 4th T Block', lat: 12.9308, lng: 77.5838, pincode: '560011' },
    ],
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    lat: 17.385,
    lng: 78.4867,
    popular: true,
    pincodes: ['500033', '500034', '500081', '500032', '500003'],
    localities: [
      { name: 'Jubilee Hills Road No. 72', lat: 17.4262, lng: 78.4116, pincode: '500033' },
      { name: 'Banjara Hills Road No. 1', lat: 17.4173, lng: 78.4482, pincode: '500034' },
      { name: 'Hitec City Mindspace', lat: 17.4435, lng: 78.3772, pincode: '500081' },
      { name: 'Gachibowli Financial District', lat: 17.4401, lng: 78.3489, pincode: '500032' },
      { name: 'Secunderabad (KIMS Hub)', lat: 17.4419, lng: 78.4891, pincode: '500003' },
    ],
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lng: 80.2707,
    popular: true,
    pincodes: ['600006', '600017', '600040', '600020', '600042'],
    localities: [
      { name: 'Greams Road / Thousand Lights', lat: 13.0569, lng: 80.2525, pincode: '600006' },
      { name: 'T Nagar Panagal Park', lat: 13.0418, lng: 80.2341, pincode: '600017' },
      { name: 'Anna Nagar Roundtana', lat: 13.085, lng: 80.2101, pincode: '600040' },
      { name: 'Adyar LB Road', lat: 13.0012, lng: 80.2565, pincode: '600020' },
      { name: 'Velachery Main Road', lat: 12.9759, lng: 80.2212, pincode: '600042' },
    ],
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
    popular: true,
    pincodes: ['411038', '411014', '411057', '411045', '411004'],
    localities: [
      { name: 'Kothrud Paud Road', lat: 18.5074, lng: 73.8077, pincode: '411038' },
      { name: 'Viman Nagar Phoenix Area', lat: 18.5679, lng: 73.9143, pincode: '411014' },
      { name: 'Hinjewadi Phase 1', lat: 18.5913, lng: 73.7389, pincode: '411057' },
      { name: 'Baner Balewadi High Street', lat: 18.559, lng: 73.7868, pincode: '411045' },
      { name: 'Deccan Gymkhana', lat: 18.5173, lng: 73.8415, pincode: '411004' },
    ],
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    lat: 23.0225,
    lng: 72.5714,
    popular: false,
    pincodes: ['380009', '380054', '380015', '380058'],
    localities: [
      { name: 'Navrangpura CG Road', lat: 23.0365, lng: 72.5611, pincode: '380009' },
      { name: 'Bodakdev SG Highway', lat: 23.0456, lng: 72.5113, pincode: '380054' },
      { name: 'Satellite Shyamal Cross Roads', lat: 23.0189, lng: 72.5284, pincode: '380015' },
    ],
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.9124,
    lng: 75.7873,
    popular: false,
    pincodes: ['302001', '302017', '302021', '302020'],
    localities: [
      { name: 'C-Scheme Ashok Nagar', lat: 26.9103, lng: 75.8012, pincode: '302001' },
      { name: 'Malviya Nagar JLN Marg', lat: 26.8524, lng: 75.8167, pincode: '302017' },
      { name: 'Vaishali Nagar Amrapali', lat: 26.9189, lng: 75.7423, pincode: '302021' },
    ],
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    lat: 26.8467,
    lng: 80.9462,
    popular: false,
    pincodes: ['226010', '226001', '226024', '226016'],
    localities: [
      { name: 'Gomti Nagar Vibhuti Khand', lat: 26.8624, lng: 80.9982, pincode: '226010' },
      { name: 'Hazratganj Main', lat: 26.8489, lng: 80.9421, pincode: '226001' },
      { name: 'Aliganj Sector B', lat: 26.8872, lng: 80.9419, pincode: '226024' },
    ],
  },
];

export const ALL_STATES = [
  'Delhi',
  'Maharashtra',
  'Karnataka',
  'West Bengal',
  'Telangana',
  'Tamil Nadu',
  'Gujarat',
  'Rajasthan',
  'Uttar Pradesh',
  'Punjab',
  'Madhya Pradesh',
];

export const ALL_SPECIALIZATIONS = [
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'Neurologist',
  'Orthopedic',
  'Pediatrician',
  'Gynecologist',
  'Dentist',
  'ENT Specialist',
  'Ophthalmologist',
  'Psychiatrist',
  'Gastroenterologist',
  'Urologist',
  'Oncologist',
  'Endocrinologist',
  'Pulmonologist',
];
