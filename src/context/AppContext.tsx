import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppRole,
  LanguageCode,
  UserProfile,
  Appointment,
  AmbulanceBooking,
  CartItem,
  MedicineProduct,
  MedicineOrder,
  TestBooking,
  ConsultationSession,
  BloodRequest,
  DonorRegistration,
  HealthRecord,
  MedicineReminder,
  VitalMeasurement,
  AppNotification,
  SavedAddress,
  FamilyMember,
} from '../types';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_HEALTH_RECORDS,
  INITIAL_MEDICINE_REMINDERS,
  INITIAL_FAMILY_MEMBERS,
  INITIAL_VITALS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ADDRESSES,
  HOSPITALS,
  DOCTORS,
} from '../data/mockData';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from '../translations';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface AppContextType {
  // Roles & Viewport
  currentRole: AppRole;
  setCurrentRole: (role: AppRole) => void;
  viewportMode: 'mobile-frame' | 'responsive';
  setViewportMode: (mode: 'mobile-frame' | 'responsive') => void;

  // Language & Translations
  currentLanguage: LanguageCode;
  setCurrentLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;

  // Authentication & User
  user: UserProfile | null;
  isGuest: boolean;
  loginAsPatient: (isGuest?: boolean) => void;
  loginAsDoctor: () => void;
  logout: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;

  // Guest Gatekeeper
  requireAuth: (intendedAction: () => void, promptMessage?: string) => void;
  isAuthModalOpen: boolean;
  closeAuthModal: () => void;
  authPromptMessage: string;

  // Navigation
  currentScreen: string;
  screenParams: any;
  screenHistory: Array<{ screen: string; params?: any }>;
  navigateTo: (screen: string, params?: any) => void;
  goBack: () => void;
  activeBottomTab: 'home' | 'my-bookings' | 'health' | 'notifications' | 'profile';
  setActiveBottomTab: (tab: 'home' | 'my-bookings' | 'health' | 'notifications' | 'profile') => void;

  // Location
  currentCity: string;
  setCurrentCity: (city: string) => void;
  currentArea: string;
  setCurrentArea: (area: string) => void;
  isLiveLocation: boolean;
  isDetectingLocation: boolean;
  liveCoordinates: { latitude: number; longitude: number; accuracy?: number } | null;
  detectLiveLocation: () => Promise<void>;

  // Data & State
  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'bookingId' | 'createdAt'>) => Appointment;
  cancelAppointment: (id: string, reason?: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newSlot: string) => void;

  // Cart & Pharmacy
  cart: CartItem[];
  addToCart: (product: MedicineProduct, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  medicineOrders: MedicineOrder[];
  placeMedicineOrder: (order: Omit<MedicineOrder, 'id' | 'orderNumber' | 'createdAt'>) => MedicineOrder;

  // Diagnostics & Checkups
  testBookings: TestBooking[];
  addTestBooking: (booking: Omit<TestBooking, 'id' | 'bookingCode' | 'createdAt'>) => TestBooking;

  // Ambulance
  activeAmbulanceBooking: AmbulanceBooking | null;
  createAmbulanceBooking: (booking: Omit<AmbulanceBooking, 'id' | 'status' | 'createdAt'>) => void;
  cancelAmbulanceBooking: () => void;

  // Blood Bank
  bloodRequests: BloodRequest[];
  createBloodRequest: (req: Omit<BloodRequest, 'id' | 'status' | 'createdAt'>) => void;
  registeredDonors: DonorRegistration[];
  registerDonor: (donor: Omit<DonorRegistration, 'id' | 'createdAt'>) => void;

  // Health Dashboard
  healthRecords: HealthRecord[];
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => void;
  deleteHealthRecord: (id: string) => void;

  medicineReminders: MedicineReminder[];
  toggleReminderTaken: (id: string, index: number) => void;
  addMedicineReminder: (reminder: Omit<MedicineReminder, 'id' | 'takenToday'>) => void;
  deleteMedicineReminder: (id: string) => void;

  familyMembers: FamilyMember[];
  activeFamilyMemberId: string;
  setActiveFamilyMemberId: (id: string) => void;
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;

  vitals: VitalMeasurement[];
  addVitalMeasurement: (vital: Omit<VitalMeasurement, 'id' | 'timestamp'>) => void;

  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;

  savedAddresses: SavedAddress[];
  addAddress: (addr: Omit<SavedAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;

  // UI Toast & Confirm
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  removeToast: (id: string) => void;
  confirmDialog: ConfirmDialogConfig | null;
  showConfirmDialog: (config: ConfirmDialogConfig) => void;
  closeConfirmDialog: () => void;

  // Active Live Consultation
  activeConsultation: ConsultationSession | null;
  startConsultation: (session: ConsultationSession) => void;
  endConsultation: () => void;
  sendConsultationMessage: (text: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_USER: UserProfile = {
  id: 'usr-1',
  name: 'Subhasis Gupta',
  phone: '+91 98301 54321',
  email: 'subhasis.gupta@example.com',
  role: 'patient',
  gender: 'male',
  dob: '1978-05-14',
  bloodGroup: 'B+',
  preferredLanguage: 'en',
  address: 'Salt Lake Sector 1, Kolkata',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  isGuest: false,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // App views
  const [currentRole, setCurrentRole] = useState<AppRole>('patient');
  const [viewportMode, setViewportMode] = useState<'mobile-frame' | 'responsive'>('mobile-frame');

  // Navigation
  const [currentScreen, setCurrentScreen] = useState<string>('splash');
  const [screenParams, setScreenParams] = useState<any>(null);
  const [screenHistory, setScreenHistory] = useState<Array<{ screen: string; params?: any }>>([]);
  const [activeBottomTab, setActiveBottomTab] = useState<'home' | 'my-bookings' | 'health' | 'notifications' | 'profile'>('home');

  // Language
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

  // Auth & Guest
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authPromptMessage, setAuthPromptMessage] = useState<string>('Sign in to continue');
  const [pendingActionAfterAuth, setPendingActionAfterAuth] = useState<(() => void) | null>(null);

  // Location
  const [currentCity, setCurrentCity] = useState<string>('Kolkata');
  const [currentArea, setCurrentArea] = useState<string>('Salt Lake');
  const [isLiveLocation, setIsLiveLocation] = useState<boolean>(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [liveCoordinates, setLiveCoordinates] = useState<{
    latitude: number;
    longitude: number;
    accuracy?: number;
  } | null>(null);

  // Automatic Real GPS & IP Location Detector
  const detectLiveLocation = async () => {
    setIsDetectingLocation(true);

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLiveCoordinates({
            latitude: lat,
            longitude: lon,
            accuracy: position.coords.accuracy,
          });

          try {
            // Reverse geocode via OpenStreetMap Nominatim
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
              {
                headers: { 'Accept-Language': 'en' },
              }
            );

            if (response.ok) {
              const data = await response.json();
              const addr = data.address || {};
              const city =
                addr.city ||
                addr.town ||
                addr.municipality ||
                addr.county ||
                addr.state_district ||
                addr.state ||
                'Current City';
              const area =
                addr.suburb ||
                addr.neighbourhood ||
                addr.residential ||
                addr.road ||
                addr.village ||
                addr.hamlet ||
                'Live Location';

              setCurrentCity(city);
              setCurrentArea(area);
              setIsLiveLocation(true);
              showToast(`📍 Live Location Detected: ${area}, ${city}`, 'success');
            } else {
              fallbackToIP();
            }
          } catch (err) {
            fallbackToIP();
          } finally {
            setIsDetectingLocation(false);
          }
        },
        async (error) => {
          console.warn('GPS location request warning/denied, checking network location...', error);
          await fallbackToIP();
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    } else {
      await fallbackToIP();
    }
  };

  // Fallback to IP-based location if GPS permission denied or unavailable
  const fallbackToIP = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const ipData = await res.json();
        if (ipData.city) {
          setCurrentCity(ipData.city);
          setCurrentArea(ipData.region || ipData.city);
          setIsLiveLocation(true);
          showToast(`📍 Live Location Detected via Network: ${ipData.city}`, 'info');
        }
      }
    } catch (e) {
      // Keep defaults gracefully if completely offline
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Automatically detect live location on initial mount!
  useEffect(() => {
    detectLiveLocation();
  }, []);

  // Collections
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [medicineOrders, setMedicineOrders] = useState<MedicineOrder[]>([]);
  const [testBookings, setTestBookings] = useState<TestBooking[]>([]);
  const [activeAmbulanceBooking, setActiveAmbulanceBooking] = useState<AmbulanceBooking | null>(null);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [registeredDonors, setRegisteredDonors] = useState<DonorRegistration[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(INITIAL_HEALTH_RECORDS);
  const [medicineReminders, setMedicineReminders] = useState<MedicineReminder[]>(INITIAL_MEDICINE_REMINDERS);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(INITIAL_FAMILY_MEMBERS);
  const [activeFamilyMemberId, setActiveFamilyMemberId] = useState<string>('fam-self');
  const [vitals, setVitals] = useState<VitalMeasurement[]>(INITIAL_VITALS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(INITIAL_ADDRESSES);

  // Active consultation
  const [activeConsultation, setActiveConsultation] = useState<ConsultationSession | null>(null);

  // Toasts & Confirmations
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogConfig | null>(null);

  // Splash auto-transition to welcome
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('welcome');
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Translation helper
  const t = (key: string): string => {
    const langDict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  // Toast Helpers
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Confirm dialog
  const showConfirmDialog = (config: ConfirmDialogConfig) => {
    setConfirmDialog(config);
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(null);
  };

  // Stack Navigation
  const navigateTo = (screen: string, params?: any) => {
    setScreenHistory((prev) => [...prev, { screen: currentScreen, params: screenParams }]);
    setCurrentScreen(screen);
    setScreenParams(params || null);

    // Keep bottom tab state aligned
    if (['home', 'my-bookings', 'health', 'notifications', 'profile'].includes(screen)) {
      setActiveBottomTab(screen as any);
    }
  };

  const goBack = () => {
    if (screenHistory.length > 0) {
      const previous = screenHistory[screenHistory.length - 1];
      setScreenHistory((prev) => prev.slice(0, prev.length - 1));
      setCurrentScreen(previous.screen);
      setScreenParams(previous.params || null);

      if (['home', 'my-bookings', 'health', 'notifications', 'profile'].includes(previous.screen)) {
        setActiveBottomTab(previous.screen as any);
      }
    } else {
      setCurrentScreen('home');
      setActiveBottomTab('home');
    }
  };

  // Auth Gatekeeper for Guest Mode
  const requireAuth = (intendedAction: () => void, promptMessage = 'Sign in to access this feature') => {
    if (isGuest || !user) {
      setAuthPromptMessage(promptMessage);
      setPendingActionAfterAuth(() => intendedAction);
      setIsAuthModalOpen(true);
    } else {
      intendedAction();
    }
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingActionAfterAuth(null);
  };

  // Logins
  const loginAsPatient = (guestMode = false) => {
    if (guestMode) {
      setIsGuest(true);
      setUser(null);
      showToast('Browsing as Guest. Certain features will prompt for sign in.', 'info');
    } else {
      setIsGuest(false);
      setUser(DEFAULT_USER);
      showToast(`Welcome back, ${DEFAULT_USER.name}!`, 'success');
      if (pendingActionAfterAuth) {
        const action = pendingActionAfterAuth;
        setPendingActionAfterAuth(null);
        setIsAuthModalOpen(false);
        action();
        return;
      }
    }
    setIsAuthModalOpen(false);
    setCurrentScreen('home');
    setActiveBottomTab('home');
  };

  const loginAsDoctor = () => {
    setIsGuest(false);
    setUser({
      id: 'doc-1',
      name: 'Dr. Arindam Mukherjee',
      phone: '+91 98301 99999',
      email: 'dr.arindam@doctorg.com',
      role: 'doctor',
      gender: 'male',
      dob: '1975-08-20',
      bloodGroup: 'O+',
      preferredLanguage: 'en',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    });
    setCurrentRole('doctor');
    showToast('Switched to Doctor Clinical Portal', 'success');
  };

  const logout = () => {
    setUser(null);
    setIsGuest(true);
    showToast('Logged out successfully', 'info');
    setCurrentScreen('welcome');
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...data });
      showToast('Profile updated successfully', 'success');
    }
  };

  // Appointments
  const addAppointment = (aptData: Omit<Appointment, 'id' | 'bookingId' | 'createdAt'>): Appointment => {
    const newId = `apt-${Date.now()}`;
    const newBookingId = `DG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApt: Appointment = {
      ...aptData,
      id: newId,
      bookingId: newBookingId,
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => [newApt, ...prev]);
    showToast(`Appointment confirmed! Booking ID: ${newBookingId}`, 'success');
    return newApt;
  };

  const cancelAppointment = (id: string, reason?: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, bookingStatus: 'CANCELLED', queueStatus: 'CANCELLED' } : apt))
    );
    showToast('Appointment cancelled. Refund (if applicable) initiated.', 'info');
  };

  const rescheduleAppointment = (id: string, newDate: string, newSlot: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, date: newDate, timeSlot: newSlot } : apt))
    );
    showToast('Appointment rescheduled successfully.', 'success');
  };

  // Cart & Orders
  const addToCart = (product: MedicineProduct, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name} to cart`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => setCart([]);

  const placeMedicineOrder = (orderData: Omit<MedicineOrder, 'id' | 'orderNumber' | 'createdAt'>): MedicineOrder => {
    const newId = `ord-${Date.now()}`;
    const newOrderNumber = `DG-MED-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: MedicineOrder = {
      ...orderData,
      id: newId,
      orderNumber: newOrderNumber,
      createdAt: new Date().toISOString(),
    };
    setMedicineOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(`Order #${newOrderNumber} placed successfully!`, 'success');
    return newOrder;
  };

  // Diagnostics
  const addTestBooking = (bookingData: Omit<TestBooking, 'id' | 'bookingCode' | 'createdAt'>): TestBooking => {
    const newId = `tst-${Date.now()}`;
    const bookingCode = `DG-LAB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: TestBooking = {
      ...bookingData,
      id: newId,
      bookingCode,
      createdAt: new Date().toISOString(),
    };
    setTestBookings((prev) => [newBooking, ...prev]);
    showToast(`Test booked successfully! Code: ${bookingCode}`, 'success');
    return newBooking;
  };

  // Ambulance
  const createAmbulanceBooking = (bookingData: Omit<AmbulanceBooking, 'id' | 'status' | 'createdAt'>) => {
    const booking: AmbulanceBooking = {
      ...bookingData,
      id: `amb-book-${Date.now()}`,
      status: 'ASSIGNED',
      createdAt: new Date().toISOString(),
    };
    setActiveAmbulanceBooking(booking);
    showToast('Ambulance dispatched! Live tracking enabled.', 'success');
  };

  const cancelAmbulanceBooking = () => {
    setActiveAmbulanceBooking(null);
    showToast('Ambulance request cancelled.', 'info');
  };

  // Blood Bank
  const createBloodRequest = (req: Omit<BloodRequest, 'id' | 'status' | 'createdAt'>) => {
    const newReq: BloodRequest = {
      ...req,
      id: `bld-req-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    setBloodRequests((prev) => [newReq, ...prev]);
    showToast(`Emergency request for ${req.unitsNeeded} units of ${req.bloodGroup} broadcasted!`, 'success');
  };

  const registerDonor = (donor: Omit<DonorRegistration, 'id' | 'createdAt'>) => {
    const newDonor: DonorRegistration = {
      ...donor,
      id: `dnr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setRegisteredDonors((prev) => [newDonor, ...prev]);
    showToast('Registered as life-saving blood donor! Thank you.', 'success');
  };

  // Health Records
  const addHealthRecord = (record: Omit<HealthRecord, 'id'>) => {
    const newRec: HealthRecord = {
      ...record,
      id: `rec-${Date.now()}`,
    };
    setHealthRecords((prev) => [newRec, ...prev]);
    showToast('Document uploaded successfully to Health Records', 'success');
  };

  const deleteHealthRecord = (id: string) => {
    setHealthRecords((prev) => prev.filter((r) => r.id !== id));
    showToast('Record deleted', 'info');
  };

  // Medicine Reminders
  const toggleReminderTaken = (id: string, index: number) => {
    setMedicineReminders((prev) =>
      prev.map((rem) => {
        if (rem.id === id) {
          const updatedTaken = [...rem.takenToday];
          updatedTaken[index] = !updatedTaken[index];
          return { ...rem, takenToday: updatedTaken };
        }
        return rem;
      })
    );
  };

  const addMedicineReminder = (reminder: Omit<MedicineReminder, 'id' | 'takenToday'>) => {
    const newRem: MedicineReminder = {
      ...reminder,
      id: `rem-${Date.now()}`,
      takenToday: new Array(reminder.timeSlots.length).fill(false),
    };
    setMedicineReminders((prev) => [newRem, ...prev]);
    showToast('Medicine reminder added!', 'success');
  };

  const deleteMedicineReminder = (id: string) => {
    setMedicineReminders((prev) => prev.filter((r) => r.id !== id));
    showToast('Reminder deleted', 'info');
  };

  // Family Members
  const addFamilyMember = (member: Omit<FamilyMember, 'id'>) => {
    const newMember: FamilyMember = {
      ...member,
      id: `fam-${Date.now()}`,
    };
    setFamilyMembers((prev) => [...prev, newMember]);
    showToast(`Added ${member.name} to Family Health`, 'success');
  };

  // Vitals
  const addVitalMeasurement = (vital: Omit<VitalMeasurement, 'id' | 'timestamp'>) => {
    const newVital: VitalMeasurement = {
      ...vital,
      id: `v-${Date.now()}`,
      timestamp: 'Just now',
    };
    setVitals((prev) => [newVital, ...prev]);
    showToast(`Logged ${vital.type} measurement: ${vital.value} ${vital.unit}`, 'success');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Addresses
  const addAddress = (addr: Omit<SavedAddress, 'id'>) => {
    const newAddr: SavedAddress = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    setSavedAddresses((prev) => [...prev, newAddr]);
    showToast('New address saved', 'success');
  };

  const deleteAddress = (id: string) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('Address deleted', 'info');
  };

  // Online Consultation Live Session
  const startConsultation = (session: ConsultationSession) => {
    setActiveConsultation(session);
    navigateTo('online-consultation-call');
  };

  const endConsultation = () => {
    if (activeConsultation) {
      setActiveConsultation((prev) =>
        prev
          ? {
              ...prev,
              status: 'COMPLETED',
              doctorInstructions: 'Continue prescribed medications, drink adequate warm liquids, and follow up in 7 days if symptoms persist.',
              issuedPrescriptionUrl: '#',
            }
          : null
      );
      navigateTo('online-consultation-summary');
    }
  };

  const sendConsultationMessage = (text: string) => {
    if (!activeConsultation) return;
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'patient' as const,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setActiveConsultation((prev) =>
      prev ? { ...prev, messages: [...prev.messages, userMsg] } : null
    );

    // Simulate doctor response after 1.5s
    setTimeout(() => {
      const docMsg = {
        id: `msg-doc-${Date.now()}`,
        sender: 'doctor' as const,
        text: 'Understood. Please rest well and ensure you take your doses with food. Feel free to contact if temperature spikes above 101°F.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setActiveConsultation((prev) =>
        prev ? { ...prev, messages: [...prev.messages, docMsg] } : null
      );
    }, 1500);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        viewportMode,
        setViewportMode,
        currentLanguage,
        setCurrentLanguage,
        t,
        user,
        isGuest,
        loginAsPatient,
        loginAsDoctor,
        logout,
        updateUserProfile,
        requireAuth,
        isAuthModalOpen,
        closeAuthModal,
        authPromptMessage,
        currentScreen,
        screenParams,
        screenHistory,
        navigateTo,
        goBack,
        activeBottomTab,
        setActiveBottomTab,
        currentCity,
        setCurrentCity,
        currentArea,
        setCurrentArea,
        isLiveLocation,
        isDetectingLocation,
        liveCoordinates,
        detectLiveLocation,
        appointments,
        addAppointment,
        cancelAppointment,
        rescheduleAppointment,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        medicineOrders,
        placeMedicineOrder,
        testBookings,
        addTestBooking,
        activeAmbulanceBooking,
        createAmbulanceBooking,
        cancelAmbulanceBooking,
        bloodRequests,
        createBloodRequest,
        registeredDonors,
        registerDonor,
        healthRecords,
        addHealthRecord,
        deleteHealthRecord,
        medicineReminders,
        toggleReminderTaken,
        addMedicineReminder,
        deleteMedicineReminder,
        familyMembers,
        activeFamilyMemberId,
        setActiveFamilyMemberId,
        addFamilyMember,
        vitals,
        addVitalMeasurement,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        savedAddresses,
        addAddress,
        deleteAddress,
        toasts,
        showToast,
        removeToast,
        confirmDialog,
        showConfirmDialog,
        closeConfirmDialog,
        activeConsultation,
        startConsultation,
        endConsultation,
        sendConsultationMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
