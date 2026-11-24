// Doctor G - Core TypeScript Definitions

export type AppRole = 'patient' | 'doctor' | 'hospital' | 'admin' | 'laboratory' | 'medical_shop';

export type LanguageCode =
  | 'en'
  | 'hi'
  | 'bn'
  | 'mr'
  | 'gu'
  | 'ta'
  | 'te'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'or'
  | 'as'
  | 'ur';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'patient' | 'doctor';
  gender: 'male' | 'female' | 'other';
  dob: string;
  bloodGroup: string;
  preferredLanguage: LanguageCode;
  address?: string;
  avatarUrl?: string;
  isGuest?: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'Self' | 'Father' | 'Mother' | 'Spouse' | 'Child' | 'Sibling' | 'Other';
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodGroup: string;
  allergies?: string[];
}

export interface Department {
  id: string;
  name: string;
  iconName: string;
  doctorCount: number;
  description: string;
}

export interface Hospital {
  id: string;
  name: string;
  type: 'Private' | 'Government';
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  area: string;
  distance: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  verified: boolean;
  phone: string;
  emergencyPhone: string;
  openingHours: string;
  departments: string[];
  facilities: string[];
  bedsAvailable: number;
  about: string;
  latitude?: number;
  longitude?: number;
  isDemo: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  departmentId: string;
  qualification: string;
  experienceYears: number;
  hospitalId: string;
  hospitalName: string;
  clinicAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  area?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string;
  phone?: string;
  email?: string;
  appointmentAvailability?: string;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  verified: boolean;
  availableDays: string[];
  languages: string[];
  about: string;
  nextSlot: string;
  isDemo: boolean;
}

export type QueueStatus =
  | 'WAITING'
  | 'APPROACHING'
  | 'PLEASE_PROCEED'
  | 'CALLED'
  | 'IN CONSULTATION'
  | 'COMPLETED'
  | 'SKIPPED'
  | 'CANCELLED'
  | 'NO SHOW';

export type OfficialAppointmentStatus =
  | 'Confirmed'
  | 'Waiting'
  | 'Your Turn Approaching'
  | 'Please Proceed to OPD'
  | 'In Consultation'
  | 'Completed'
  | 'Cancelled';

export interface Appointment {
  id: string;
  bookingId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  hospitalId: string;
  hospitalName: string;
  hospitalAddress: string;
  department: string;
  date: string;
  timeSlot: string;
  consultationType: 'in-person' | 'video' | 'audio' | 'chat';
  fee: number;
  paymentStatus: 'PAID' | 'PAY_AT_HOSPITAL' | 'PENDING' | 'REFUNDED';
  paymentMethod: string;
  bookingStatus: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  tokenNumber: number;
  currentToken: number;
  patientNumber?: number;
  patientNumberStr?: string;
  opdRoom?: string;
  officialStatus?: OfficialAppointmentStatus;
  estimatedWaitMinutes: number;
  queueStatus: QueueStatus;
  reason: string;
  symptoms?: string[];
  notes?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  isDemo: boolean;
}

export interface AmbulanceService {
  id: string;
  type: 'Basic Ambulance' | 'Advanced Life Support' | 'ICU Ambulance' | 'Patient Transport';
  tagline: string;
  equipment: string[];
  eta: string;
  fareEstimate: number;
  providerName: string;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  isDemo: boolean;
}

export interface AmbulanceBooking {
  id: string;
  serviceType: string;
  pickupLocation: string;
  destinationHospital: string;
  patientName: string;
  patientPhone: string;
  emergencyContact: string;
  assistanceType: string;
  status: 'REQUESTED' | 'ASSIGNED' | 'EN_ROUTE' | 'ARRIVED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  driverName: string;
  driverPhone: string;
  vehicleNo: string;
  etaMinutes: number;
  currentLat: number;
  currentLng: number;
  createdAt: string;
}

export interface MedicineProduct {
  id: string;
  name: string;
  brand: string;
  category: 'Medicines' | 'Personal care' | 'Medical devices' | 'First aid' | 'Vitamins' | 'Healthcare products';
  price: number;
  mrp: number;
  discountPercentage: number;
  requiresPrescription: boolean;
  packageSize: string;
  composition: string;
  imageUrl: string;
  inStock: boolean;
  description: string;
  safetyInstructions: string;
  dosageAdvice: string;
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  product: MedicineProduct;
  quantity: number;
}

export interface MedicineOrder {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  deliveryContact: string;
  prescriptionUploaded: boolean;
  prescriptionUrl?: string;
  paymentMethod: string;
  status: 'PLACED' | 'VERIFYING_RX' | 'PREPARING' | 'READY_DISPATCH' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  estimatedDelivery: string;
  createdAt: string;
}

export interface DiagnosticTest {
  id: string;
  name: string;
  shortDescription: string;
  category: 'Blood' | 'Thyroid' | 'Diabetes' | 'Heart' | 'Liver' | 'Kidney' | 'Vitamins' | 'Hormones' | 'Infection' | 'Imaging';
  price: number;
  mrp: number;
  labName: string;
  labRating: number;
  sampleType: string;
  preparationRequired: string;
  homeCollectionAvailable: boolean;
  reportTimeHours: number;
  whyPerformed: string;
  isDemo: boolean;
}

export interface HealthPackage {
  id: string;
  name: string;
  category: 'Full Body Checkup' | 'Basic Health' | 'Senior Citizen' | 'Women' | 'Men' | 'Heart Health' | 'Diabetes' | 'Preventive Health';
  testsCount: number;
  price: number;
  mrp: number;
  discountPercent: number;
  labName: string;
  sampleType: string;
  homeCollection: boolean;
  reportTimeHours: number;
  description: string;
  preparationInstructions: string;
  testsIncluded: string[];
  popularTag?: string;
  isDemo: boolean;
}

export interface TestBooking {
  id: string;
  bookingCode: string;
  testOrPackageName: string;
  type: 'single-test' | 'package';
  labName: string;
  collectionMethod: 'HOME_COLLECTION' | 'LAB_VISIT';
  collectionAddress?: string;
  date: string;
  timeSlot: string;
  patientName: string;
  amount: number;
  paymentStatus: 'PAID' | 'PAY_AT_COLLECTION';
  status: 'BOOKED' | 'SAMPLE_COLLECTED' | 'PROCESSING' | 'REPORT_READY';
  reportUrl?: string;
  createdAt: string;
}

export interface ConsultationSession {
  id: string;
  consultationType: 'video' | 'audio' | 'chat';
  doctorId: string;
  doctorName: string;
  specialty: string;
  doctorImage: string;
  patientName: string;
  status: 'WAITING' | 'CONNECTED' | 'IN_CALL' | 'COMPLETED';
  startTime?: string;
  durationSeconds: number;
  messages: Array<{
    id: string;
    sender: 'doctor' | 'patient' | 'system';
    text: string;
    timestamp: string;
    attachmentUrl?: string;
  }>;
  doctorInstructions?: string;
  issuedPrescriptionUrl?: string;
}

export interface BloodBankItem {
  id: string;
  name: string;
  address: string;
  city: string;
  area: string;
  distance: string;
  phone: string;
  verified: boolean;
  stock: Record<string, 'Available' | 'Low' | 'Out of Stock'>;
  unitsAvailable: Record<string, number>;
  lastUpdated: string;
  isDemo: boolean;
}

export interface BloodRequest {
  id: string;
  bloodGroup: string;
  unitsNeeded: number;
  hospitalName: string;
  city: string;
  requiredDate: string;
  contactPerson: string;
  contactNumber: string;
  urgency: 'Immediate (Critical)' | 'Within 24 Hours' | 'Scheduled Surgery';
  notes: string;
  status: 'PENDING' | 'MATCHED' | 'FULFILLED' | 'CANCELLED';
  createdAt: string;
}

export interface DonorRegistration {
  id: string;
  name: string;
  bloodGroup: string;
  city: string;
  phone: string;
  availableNow: boolean;
  lastDonationDate?: string;
  createdAt: string;
}

export interface TraditionalPractitioner {
  id: string;
  name: string;
  type: 'Ayurvedic Consultant' | 'Homeopathy Specialist' | 'Naturopath' | 'Unani Physician' | 'Traditional Wellness Guide';
  description: string;
  experienceYears: number;
  location: string;
  contactPhone: string;
  availableDays: string[];
  rating: number;
  reviewsCount: number;
  services: string[];
  isDemo: boolean;
}

export interface HealthRecord {
  id: string;
  title: string;
  category: 'Prescriptions' | 'Lab reports' | 'Medical documents' | 'Imaging' | 'Discharge summaries' | 'Vaccination records' | 'Other documents';
  date: string;
  doctorOrProvider: string;
  fileSize: string;
  fileType: 'pdf' | 'jpg' | 'png';
  fileUrl: string;
  notes?: string;
}

export interface MedicineReminder {
  id: string;
  medicineName: string;
  dosage: string;
  instructions: 'Before Food' | 'After Food' | 'With Food' | 'Empty Stomach';
  frequency: 'Once Daily' | 'Twice Daily' | 'Three Times Daily' | 'As Needed';
  timeSlots: string[];
  startDate: string;
  endDate: string;
  takenToday: boolean[];
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
}

export interface VitalMeasurement {
  id: string;
  type: 'Weight' | 'Blood Pressure' | 'Heart Rate' | 'Blood Sugar' | 'Temperature' | 'Steps' | 'Water';
  value: string;
  numericValue: number;
  unit: string;
  timestamp: string;
  statusTag: 'Normal' | 'Elevated' | 'Low' | 'High';
}

export interface AppNotification {
  id: string;
  category: 'Appointments' | 'Queue updates' | 'Medicine reminders' | 'Orders' | 'Lab reports' | 'Payments' | 'Health reminders';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionDestination?: string;
}

export interface SavedAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  name: string;
  phone: string;
  flat: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  service: string;
  date: string;
  amount: number;
  method: 'UPI' | 'Debit Card' | 'Credit Card' | 'Wallet' | 'Pay at Hospital';
  status: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
  bookingOrOrderId: string;
}

export interface ServiceReview {
  id: string;
  targetType: 'Doctor' | 'Hospital' | 'Lab' | 'Pharmacy' | 'Ambulance';
  targetId: string;
  targetName: string;
  rating: number;
  comment: string;
  tags: string[];
  userName: string;
  createdAt: string;
}
