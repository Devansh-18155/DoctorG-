import React from 'react';
import { useApp } from './context/AppContext';
import { DevTopBar } from './components/common/DevTopBar';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { ConfirmModal } from './components/common/ConfirmModal';
import { AuthModal } from './components/common/AuthModal';

// Screens
import { SplashScreen } from './screens/auth/SplashScreen';
import { WelcomeScreen } from './screens/auth/WelcomeScreen';
import { LoginScreen } from './screens/auth/LoginScreen';
import { RegisterScreen } from './screens/auth/RegisterScreen';
import { OtpVerifyScreen } from './screens/auth/OtpVerifyScreen';
import { ForgotPasswordScreen } from './screens/auth/ForgotPasswordScreen';
import { HomeScreen } from './screens/home/HomeScreen';
import { SearchScreen } from './screens/search/SearchScreen';
import { BookAppointmentFlow } from './screens/appointment/BookAppointmentFlow';
import { MyBookingsScreen } from './screens/bookings/MyBookingsScreen';
import { AppointmentDetailsScreen } from './screens/bookings/AppointmentDetailsScreen';
import { LiveQueueScreen } from './screens/bookings/LiveQueueScreen';
import { FindAmbulanceScreen } from './screens/services/FindAmbulanceScreen';
import { MedicalStoreScreen } from './screens/services/MedicalStoreScreen';
import { MedicalCheckupScreen } from './screens/services/MedicalCheckupScreen';
import { AllCheckupsScreen } from './screens/services/AllCheckupsScreen';
import { OnlineConsultationScreen } from './screens/services/OnlineConsultationScreen';
import { BloodBankScreen } from './screens/services/BloodBankScreen';
import { TraditionalHealingScreen } from './screens/services/TraditionalHealingScreen';
import { HealthScreen } from './screens/health/HealthScreen';
import { HealthRecordsScreen } from './screens/health/HealthRecordsScreen';
import { MedicineReminderScreen } from './screens/health/MedicineReminderScreen';
import { FamilyHealthScreen } from './screens/health/FamilyHealthScreen';
import { HealthTrackerScreen } from './screens/health/HealthTrackerScreen';
import { NotificationsScreen } from './screens/notifications/NotificationsScreen';
import { ProfileScreen } from './screens/profile/ProfileScreen';
import { EditProfileScreen } from './screens/profile/EditProfileScreen';
import { AddressManagementScreen } from './screens/profile/AddressManagementScreen';
import { PaymentHistoryScreen } from './screens/profile/PaymentHistoryScreen';
import { ReviewsScreen } from './screens/profile/ReviewsScreen';
import { HelpSupportScreen } from './screens/profile/HelpSupportScreen';
import { EmergencyScreen } from './screens/emergency/EmergencyScreen';
import { FindDoctorScreen } from './screens/doctor/FindDoctorScreen';
import { DoctorDirectionsScreen } from './screens/doctor/DoctorDirectionsScreen';
import { DoctorServicesScreen } from './screens/doctor/DoctorServicesScreen';

// Dashboards
import { DoctorDashboard } from './screens/doctor/DoctorDashboard';
import { HospitalDashboard } from './screens/hospital/HospitalDashboard';
import { AdminDashboard } from './screens/admin/AdminDashboard';
import { LaboratoryDashboard } from './screens/laboratory/LaboratoryDashboard';
import { MedicalShopDashboard } from './screens/pharmacy/MedicalShopDashboard';

export const App: React.FC = () => {
  const { currentRole, viewportMode, currentScreen } = useApp();

  // If Doctor Portal
  if (currentRole === 'doctor') {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <DevTopBar />
        <DoctorDashboard />
        <ToastContainer />
        <ConfirmModal />
      </div>
    );
  }

  // If Hospital Dashboard
  if (currentRole === 'hospital') {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <DevTopBar />
        <HospitalDashboard />
        <ToastContainer />
        <ConfirmModal />
      </div>
    );
  }

  // If Super Admin Dashboard
  if (currentRole === 'admin') {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <DevTopBar />
        <AdminDashboard />
        <ToastContainer />
        <ConfirmModal />
      </div>
    );
  }

  // If Diagnostic Laboratory Portal
  if (currentRole === 'laboratory') {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <DevTopBar />
        <LaboratoryDashboard />
        <ToastContainer />
        <ConfirmModal />
      </div>
    );
  }

  // If Medical Shop / Pharmacy Portal
  if (currentRole === 'medical_shop') {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <DevTopBar />
        <MedicalShopDashboard />
        <ToastContainer />
        <ConfirmModal />
      </div>
    );
  }

  // Screen Routing for Patient App
  const renderPatientScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'welcome':
        return <WelcomeScreen />;
      case 'doctor-services':
        return <DoctorServicesScreen />;
      case 'login':
        return <LoginScreen />;
      case 'register':
        return <RegisterScreen />;
      case 'otp-verify':
        return <OtpVerifyScreen />;
      case 'forgot-password':
        return <ForgotPasswordScreen />;
      case 'home':
        return <HomeScreen />;
      case 'search':
        return <SearchScreen />;
      case 'book-appointment':
        return <BookAppointmentFlow />;
      case 'my-bookings':
        return <MyBookingsScreen />;
      case 'appointment-details':
        return <AppointmentDetailsScreen />;
      case 'live-queue':
        return <LiveQueueScreen />;
      case 'find-ambulance':
        return <FindAmbulanceScreen />;
      case 'medical-store':
        return <MedicalStoreScreen />;
      case 'medical-checkup':
        return <MedicalCheckupScreen />;
      case 'all-checkups':
        return <AllCheckupsScreen />;
      case 'online-consultation':
      case 'online-consultation-call':
      case 'online-consultation-summary':
        return <OnlineConsultationScreen />;
      case 'blood-bank':
        return <BloodBankScreen />;
      case 'traditional-healing':
        return <TraditionalHealingScreen />;
      case 'health':
        return <HealthScreen />;
      case 'health-records':
        return <HealthRecordsScreen />;
      case 'reminders':
        return <MedicineReminderScreen />;
      case 'family-health':
        return <FamilyHealthScreen />;
      case 'health-tracker':
        return <HealthTrackerScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'edit-profile':
        return <EditProfileScreen />;
      case 'saved-addresses':
        return <AddressManagementScreen />;
      case 'payment-history':
        return <PaymentHistoryScreen />;
      case 'reviews':
        return <ReviewsScreen />;
      case 'help-support':
        return <HelpSupportScreen />;
      case 'emergency':
        return <EmergencyScreen />;
      case 'find-doctor':
        return <FindDoctorScreen />;
      case 'doctor-directions':
        return <DoctorDirectionsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const showBottomNav = [
    'home',
    'my-bookings',
    'health',
    'notifications',
    'profile',
  ].includes(currentScreen);

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col font-sans select-none">
      {/* Dev Switcher Bar */}
      <DevTopBar />

      {/* Main Viewport Container */}
      <main className="flex-1 flex items-center justify-center p-0 sm:py-6 sm:px-4">
        {viewportMode === 'mobile-frame' ? (
          /* Sleek iPhone 16 Pro Frame Mockup */
          <div className="relative w-full max-w-[420px] h-[100dvh] sm:h-[870px] bg-white sm:rounded-[50px] overflow-hidden mobile-frame-shadow flex flex-col border sm:border-[8px] sm:border-slate-800">
            {/* Dynamic Island / Status Bar for simulated device */}
            <div className="hidden sm:flex items-center justify-between px-7 pt-3 pb-1 bg-white z-30 select-none">
              <span className="text-[12px] font-black text-slate-800 tracking-tight">9:41</span>
              {/* Dynamic Island pill */}
              <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-800 text-[11px] font-bold">
                <span>5G</span>
                <span className="w-4 h-2.5 border border-slate-800 rounded-xs p-0.5 flex">
                  <span className="bg-slate-800 h-full w-full rounded-2xs"></span>
                </span>
              </div>
            </div>

            {/* Screen Content Container with Smooth Scroll */}
            <div className="flex-1 overflow-y-auto relative bg-[#F6F8FA]">
              {renderPatientScreen()}
            </div>

            {/* Bottom Nav */}
            {showBottomNav && <BottomNav />}

            {/* iPhone Home Indicator bar */}
            <div className="hidden sm:flex justify-center pb-1.5 pt-0.5 bg-white z-40">
              <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
            </div>
          </div>
        ) : (
          /* Fluid Full Width Responsive Mode */
          <div className="w-full max-w-xl mx-auto min-h-screen bg-white shadow-xl flex flex-col relative">
            <div className="flex-1 overflow-y-auto bg-[#F6F8FA]">
              {renderPatientScreen()}
            </div>
            {showBottomNav && <BottomNav />}
          </div>
        )}
      </main>

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <ConfirmModal />
      <AuthModal />
    </div>
  );
};
