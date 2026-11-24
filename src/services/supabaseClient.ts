import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 20
);

if (!isSupabaseConfigured) {
  console.info(
    '[Doctor G] Supabase environment variables not detected (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY). Running in offline/secure demonstration mode with verified local datasets.'
  );
}

// Initialize Supabase client
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// =========================================================================
// AUTHENTICATION SERVICES
// =========================================================================

export interface AuthProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'patient' | 'doctor' | 'laboratory' | 'medical_shop' | 'hospital' | 'admin';
  avatarUrl?: string;
}

/**
 * Sign up a new user with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
  phone?: string,
  role: AuthProfile['role'] = 'patient'
): Promise<{ user: User | null; session: Session | null; error: Error | null }> {
  if (!supabase) {
    return {
      user: { id: 'mock-user-id', email } as User,
      session: null,
      error: null,
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          role,
        },
      },
    });

    if (error) return { user: null, session: null, error };

    if (data.user) {
      // Upsert profile record in public.profiles table
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        email,
        phone,
        role,
      });
    }

    return { user: data.user, session: data.session, error: null };
  } catch (err: any) {
    return { user: null, session: null, error: err };
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: User | null; session: Session | null; error: Error | null }> {
  if (!supabase) {
    return {
      user: { id: 'mock-user-id', email } as User,
      session: null,
      error: null,
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data.user, session: data.session, error };
  } catch (err: any) {
    return { user: null, session: null, error: err };
  }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<{ error: Error | null }> {
  if (!supabase) {
    return { error: null };
  }

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

/**
 * Sign out of current session
 */
export async function signOut(): Promise<{ error: Error | null }> {
  if (!supabase) return { error: null };
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

/**
 * Password reset email
 */
export async function sendPasswordResetEmail(email: string): Promise<{ error: Error | null }> {
  if (!supabase) return { error: null };
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  if (!supabase) return { unsubscribe: () => {} };
  const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return { unsubscribe: () => authListener.subscription.unsubscribe() };
}

// =========================================================================
// REALTIME BOOKING MONITORING (ADMIN & PROVIDERS)
// =========================================================================

/**
 * Subscribe to real-time doctor bookings
 */
export function subscribeToLiveBookings(onNewBooking: (booking: any) => void) {
  if (!supabase) return { unsubscribe: () => {} };

  const channel = supabase
    .channel('live-bookings-feed')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'bookings' },
      (payload) => {
        onNewBooking(payload.new);
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'bookings' },
      (payload) => {
        onNewBooking(payload.new);
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}

// =========================================================================
// DATABASE OPERATIONS (BOOKINGS, LAB ORDERS, PAYMENTS)
// =========================================================================

/**
 * Create a new Doctor Appointment booking in Supabase
 */
export async function createDoctorBooking(bookingData: {
  bookingCode: string;
  patientId?: string;
  patientName: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  hospitalName: string;
  appointmentDate: string;
  appointmentTime: string;
  bookingType?: string;
  feeAmount: number;
  paymentStatus?: 'PENDING' | 'PAID';
  paymentMethod?: 'RAZORPAY' | 'PAY_AT_VISIT' | 'UPI';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  queueTokenNumber?: number;
}) {
  if (!supabase) {
    return { success: true, bookingId: `BK-${Date.now()}` };
  }

  try {
    const { data, error } = await supabase.from('bookings').insert({
      booking_code: bookingData.bookingCode,
      patient_id: bookingData.patientId || null,
      patient_name: bookingData.patientName,
      patient_phone: bookingData.patientPhone,
      patient_age: bookingData.patientAge,
      patient_gender: bookingData.patientGender,
      doctor_id: bookingData.doctorId,
      doctor_name: bookingData.doctorName,
      doctor_specialty: bookingData.doctorSpecialty,
      hospital_name: bookingData.hospitalName,
      appointment_date: bookingData.appointmentDate,
      appointment_time: bookingData.appointmentTime,
      booking_type: bookingData.bookingType || 'OPD_CONSULTATION',
      fee_amount: bookingData.feeAmount,
      status: 'CONFIRMED',
      payment_status: bookingData.paymentStatus || 'PAID',
      payment_method: bookingData.paymentMethod || 'RAZORPAY',
      razorpay_order_id: bookingData.razorpayOrderId,
      razorpay_payment_id: bookingData.razorpayPaymentId,
      queue_token_number: bookingData.queueTokenNumber || Math.floor(Math.random() * 30) + 1,
    }).select().single();

    if (error) {
      console.warn('[Doctor G Supabase] Booking insert notice:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Create a diagnostic lab order in Supabase
 */
export async function createLabOrder(orderData: {
  orderCode: string;
  userId?: string;
  patientName: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: string;
  collectionAddress?: string;
  collectionMethod: 'LAB_VISIT' | 'HOME_COLLECTION';
  laboratoryName: string;
  testIds: string[];
  appointmentDate: string;
  appointmentSlot: string;
  fastingConfirmed: boolean;
  totalAmount: number;
  paymentMethod?: 'RAZORPAY' | 'PAY_AT_VISIT';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}) {
  if (!supabase) {
    return { success: true, orderId: `LAB-${Date.now()}` };
  }

  try {
    const { data, error } = await supabase.from('lab_orders').insert({
      order_code: orderData.orderCode,
      user_id: orderData.userId || null,
      patient_name: orderData.patientName,
      patient_phone: orderData.patientPhone,
      patient_age: orderData.patientAge,
      patient_gender: orderData.patientGender,
      collection_address: orderData.collectionAddress,
      collection_method: orderData.collectionMethod,
      laboratory_name: orderData.laboratoryName,
      test_ids: orderData.testIds,
      appointment_date: orderData.appointmentDate,
      appointment_slot: orderData.appointmentSlot,
      fasting_confirmed: orderData.fastingConfirmed,
      total_amount: orderData.totalAmount,
      status: 'CONFIRMED',
      payment_status: 'PAID',
      payment_method: orderData.paymentMethod || 'RAZORPAY',
      razorpay_order_id: orderData.razorpayOrderId,
      razorpay_payment_id: orderData.razorpayPaymentId,
    }).select().single();

    if (error) {
      console.warn('[Doctor G Supabase] Lab order notice:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
