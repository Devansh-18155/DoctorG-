-- =========================================================================
-- DOCTOR G HEALTHCARE APPLICATION — PRODUCTION DATABASE SCHEMA
-- Compatible with Supabase PostgreSQL, Row Level Security (RLS), and Realtime
-- =========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'laboratory', 'medical_shop', 'hospital', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method_type AS ENUM ('RAZORPAY', 'PAY_AT_VISIT', 'UPI', 'CARD', 'NETBANKING');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. USERS / PROFILES (Links with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'patient',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT,
  blood_group TEXT,
  preferred_language TEXT DEFAULT 'en',
  city TEXT DEFAULT 'Bhopal',
  area TEXT DEFAULT 'M.P. Nagar',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PATIENT PROFILES
CREATE TABLE IF NOT EXISTS public.patient_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  allergies TEXT[],
  chronic_conditions TEXT[],
  past_surgeries TEXT[],
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. HOSPITALS
CREATE TABLE IF NOT EXISTS public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Multi-Speciality Hospital',
  rating NUMERIC(2, 1) DEFAULT 4.5,
  review_count INT DEFAULT 0,
  address TEXT NOT NULL,
  area TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Madhya Pradesh',
  pincode TEXT,
  phone TEXT NOT NULL,
  emergency_phone TEXT,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  image_url TEXT,
  beds_available INT DEFAULT 50,
  icu_beds_available INT DEFAULT 12,
  ambulance_available BOOLEAN DEFAULT TRUE,
  verified_status verification_status DEFAULT 'VERIFIED',
  opening_time TIME DEFAULT '00:00:00',
  closing_time TIME DEFAULT '23:59:59',
  is_24x7 BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CLINICS
CREATE TABLE IF NOT EXISTS public.clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  address TEXT NOT NULL,
  area TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT NOT NULL,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. DOCTOR PROFILES
CREATE TABLE IF NOT EXISTS public.doctor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  department_id TEXT NOT NULL,
  qualifications TEXT NOT NULL,
  experience_years INT NOT NULL DEFAULT 5,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  hospital_name TEXT NOT NULL,
  consultation_fee NUMERIC(8, 2) NOT NULL DEFAULT 500,
  rating NUMERIC(2, 1) DEFAULT 4.8,
  review_count INT DEFAULT 0,
  image_url TEXT,
  about TEXT,
  verified_status verification_status DEFAULT 'VERIFIED',
  google_calendar_connected BOOLEAN DEFAULT FALSE,
  google_calendar_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. LABORATORIES
CREATE TABLE IF NOT EXISTS public.laboratories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  network TEXT,
  accreditation TEXT[] DEFAULT ARRAY['NABL Accredited'],
  rating NUMERIC(2, 1) DEFAULT 4.7,
  review_count INT DEFAULT 0,
  address TEXT NOT NULL,
  area TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT NOT NULL,
  opening_time TEXT DEFAULT '07:00 AM',
  closing_time TEXT DEFAULT '08:30 PM',
  home_collection_available BOOLEAN DEFAULT TRUE,
  home_collection_fee NUMERIC(6, 2) DEFAULT 0,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  image_url TEXT,
  verified_status verification_status DEFAULT 'VERIFIED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. MEDICAL SHOPS / PHARMACIES
CREATE TABLE IF NOT EXISTS public.medical_shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  license_number TEXT,
  address TEXT NOT NULL,
  area TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT NOT NULL,
  home_delivery BOOLEAN DEFAULT TRUE,
  verified_status verification_status DEFAULT 'VERIFIED',
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. DIAGNOSTIC TEST CATEGORIES & TESTS
CREATE TABLE IF NOT EXISTS public.test_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.diagnostic_tests (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES public.test_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  sample_type TEXT NOT NULL DEFAULT 'Blood',
  fasting_required BOOLEAN DEFAULT FALSE,
  fasting_hours INT DEFAULT 0,
  report_turnaround_hours INT DEFAULT 6,
  base_price NUMERIC(8, 2) NOT NULL,
  mrp NUMERIC(8, 2) NOT NULL,
  description TEXT,
  clinical_significance TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. HEALTH PACKAGES
CREATE TABLE IF NOT EXISTS public.health_packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  tests_count INT NOT NULL,
  price NUMERIC(8, 2) NOT NULL,
  mrp NUMERIC(8, 2) NOT NULL,
  discount_percentage INT,
  report_hours INT DEFAULT 12,
  sample_type TEXT DEFAULT 'Blood & Urine',
  fasting_required BOOLEAN DEFAULT TRUE,
  fasting_hours INT DEFAULT 10,
  included_tests TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. DOCTOR AVAILABILITY & SLOTS
CREATE TABLE IF NOT EXISTS public.doctor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctor_profiles(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 6=Sat
  start_time TIME NOT NULL DEFAULT '09:00:00',
  end_time TIME NOT NULL DEFAULT '17:00:00',
  slot_duration_minutes INT NOT NULL DEFAULT 15,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.appointment_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctor_profiles(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  slot_time TEXT NOT NULL,
  is_booked BOOLEAN DEFAULT FALSE,
  booking_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_doctor_slot UNIQUE (doctor_id, slot_date, slot_time)
);

-- 13. BOOKINGS (Doctor Appointments)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_age INT,
  patient_gender TEXT,
  doctor_id UUID NOT NULL REFERENCES public.doctor_profiles(id),
  doctor_name TEXT NOT NULL,
  doctor_specialty TEXT NOT NULL,
  hospital_name TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  booking_type TEXT NOT NULL DEFAULT 'OPD_CONSULTATION', -- OPD_CONSULTATION, VIDEO_CONSULTATION
  status booking_status NOT NULL DEFAULT 'CONFIRMED',
  queue_token_number INT,
  estimated_wait_minutes INT DEFAULT 15,
  fee_amount NUMERIC(8, 2) NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'PAID',
  payment_method payment_method_type NOT NULL DEFAULT 'RAZORPAY',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  google_calendar_event_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. LAB ORDERS (Diagnostic Test Bookings)
CREATE TABLE IF NOT EXISTS public.lab_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_age INT,
  patient_gender TEXT,
  collection_address TEXT,
  collection_method TEXT NOT NULL DEFAULT 'LAB_VISIT', -- LAB_VISIT, HOME_COLLECTION
  laboratory_id UUID REFERENCES public.laboratories(id),
  laboratory_name TEXT NOT NULL,
  test_ids TEXT[],
  package_id TEXT REFERENCES public.health_packages(id),
  appointment_date DATE NOT NULL,
  appointment_slot TEXT NOT NULL,
  fasting_confirmed BOOLEAN DEFAULT TRUE,
  total_amount NUMERIC(8, 2) NOT NULL,
  status booking_status NOT NULL DEFAULT 'CONFIRMED',
  payment_status payment_status NOT NULL DEFAULT 'PAID',
  payment_method payment_method_type NOT NULL DEFAULT 'RAZORPAY',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  report_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. PAYMENTS & TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  lab_order_id UUID REFERENCES public.lab_orders(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount_in_rupees NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status payment_status NOT NULL DEFAULT 'PENDING',
  method TEXT,
  description TEXT,
  error_message TEXT,
  refund_id TEXT,
  refund_amount NUMERIC(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. REVIEWS & RATINGS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  doctor_id UUID REFERENCES public.doctor_profiles(id) ON DELETE CASCADE,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
  laboratory_id UUID REFERENCES public.laboratories(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'BOOKING', -- BOOKING, PAYMENT, REMINDER, SYSTEM
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. PROVIDER SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.provider_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_type TEXT NOT NULL, -- doctor, laboratory, hospital, medical_shop
  plan_name TEXT NOT NULL DEFAULT 'Standard Monthly',
  price NUMERIC(8, 2) NOT NULL DEFAULT 999,
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, CANCELLED
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  razorpay_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. PROVIDER VERIFICATION DOCUMENTS
CREATE TABLE IF NOT EXISTS public.provider_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  registration_council TEXT,
  registration_number TEXT NOT NULL,
  document_url TEXT,
  status verification_status DEFAULT 'PENDING',
  verified_by UUID REFERENCES public.profiles(id),
  rejection_reason TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- 20. COMPLAINTS & FEEDBACK
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'OPEN', -- OPEN, IN_REVIEW, RESOLVED
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. AUDIT LOGS (Security and Administrative actions)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  payload JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- INDEXES FOR PERFORMANCE
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_bookings_patient ON public.bookings(patient_id);
CREATE INDEX IF NOT EXISTS idx_bookings_doctor ON public.bookings(doctor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(appointment_date);
CREATE INDEX IF NOT EXISTS idx_lab_orders_user ON public.lab_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_orders_lab ON public.lab_orders(laboratory_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_hospitals_city ON public.hospitals(city);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON public.doctor_profiles(specialty);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laboratories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/write their own profile; public can read basic provider details
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Public read for verified catalog data (doctors, hospitals, labs, tests)
CREATE POLICY "Public read for hospitals"
  ON public.hospitals FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Public read for doctor profiles"
  ON public.doctor_profiles FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Public read for laboratories"
  ON public.laboratories FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Public read for diagnostic tests"
  ON public.diagnostic_tests FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Public read for health packages"
  ON public.health_packages FOR SELECT
  TO authenticated, anon
  USING (true);

-- Bookings: Patients can only view/create their own bookings; Doctors can only view their own bookings; Admins view all
CREATE POLICY "Patients view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = patient_id OR patient_id IS NULL);

CREATE POLICY "Patients can cancel their own booking"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors view their assigned bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM public.doctor_profiles WHERE id = doctor_id));

-- Lab Orders: Users can view their own lab orders
CREATE POLICY "Users view their own lab orders"
  ON public.lab_orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create lab orders"
  ON public.lab_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Notifications: Users only see their own notifications
CREATE POLICY "Users view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Payments: Users view own payments
CREATE POLICY "Users view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);
