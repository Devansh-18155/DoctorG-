import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Users,
  FileText,
  CreditCard,
  Globe,
  Bell,
  Shield,
  HelpCircle,
  Info,
  FileCheck,
  LogOut,
  ChevronRight,
  Edit3,
  Star,
  ShieldAlert,
} from 'lucide-react';
import { LanguageModal } from '../../components/common/LanguageModal';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    isGuest,
    logout,
    loginAsPatient,
    navigateTo,
    showConfirmDialog,
    currentLanguage,
    t,
  } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);

  const handleLogout = () => {
    showConfirmDialog({
      title: t('signOut', 'Sign Out') + '?',
      message: t('signOutConfirm', 'Are you sure you want to sign out of your Doctor G account?'),
      confirmLabel: t('signOut', 'Sign Out'),
      isDestructive: true,
      onConfirm: logout,
    });
  };

  return (
    <div className="min-h-full pb-20 bg-[#F6F8FA]">
      {/* Profile Header */}
      <div className="bg-white border-b border-slate-100 p-5 sticky top-0 z-20 shadow-2xs">
        <h1 className="text-lg font-extrabold text-[#172B4D]">{t('myProfile', 'My Profile')}</h1>

        {/* User Card */}
        <div className="flex items-center gap-3.5 mt-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-teal-500 shadow-md relative bg-slate-100 flex-shrink-0">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-slate-400 m-auto mt-3" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-base text-[#172B4D] truncate">
              {isGuest ? t('guestUser', 'Guest User') : user?.name || t('user', 'User')}
            </h3>
            <p className="text-xs text-slate-500 font-medium truncate">
              {isGuest ? t('browsingWithoutAccount', 'Browsing without account') : user?.phone}
            </p>
            <p className="text-[11px] text-teal-700 font-semibold truncate">
              {isGuest ? t('tapToSignIn', 'Tap to Sign In') : user?.email}
            </p>
          </div>

          {!isGuest && (
            <button
              onClick={() => navigateTo('edit-profile')}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
              title={t('editProfile', 'Edit Profile')}
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>

        {isGuest && (
          <button
            onClick={() => loginAsPatient(false)}
            className="w-full mt-4 py-2.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl font-bold text-xs shadow-xs"
          >
            {t('signInOrCreate', 'Sign In / Create Account')}
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Core Account Menu */}
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-2xs">
          <button
            onClick={() => navigateTo('edit-profile')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-teal-700" />
              <span className="text-xs font-bold text-[#172B4D]">{t('personalInfo', 'Personal Information')}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => navigateTo('saved-addresses')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-teal-700" />
              <span className="text-xs font-bold text-[#172B4D]">{t('savedAddresses', 'Saved Delivery Addresses')}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => navigateTo('family-health')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-teal-700" />
              <span className="text-xs font-bold text-[#172B4D]">{t('familyHealth', 'Family Members')}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => navigateTo('health-records')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-teal-700" />
              <span className="text-xs font-bold text-[#172B4D]">{t('healthRecords', 'My Health Records')}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => navigateTo('payment-history')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-teal-700" />
              <span className="text-xs font-bold text-[#172B4D]">{t('paymentHistory', 'Payment History & Invoices')}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => navigateTo('reviews')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-teal-700" />
              <span className="text-xs font-bold text-[#172B4D]">{t('doctorReviews', 'Ratings & Doctor Reviews')}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Settings & Preferences */}
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-2xs">
          <button
            onClick={() => setIsLangOpen(true)}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-teal-700" />
              <span className="text-xs font-bold text-[#172B4D]">{t('selectLanguage', 'Language Preference')}</span>
            </div>
            <span className="text-xs font-bold text-teal-700 uppercase bg-teal-50 px-2.5 py-1 rounded-full">
              {currentLanguage} →
            </span>
          </button>

          <button
            onClick={() => navigateTo('notifications')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-teal-700" />
              <span className="text-xs font-bold text-[#172B4D]">{t('notifications', 'Notification Alerts')}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => navigateTo('help-support')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-teal-700" />
              <span className="text-xs font-bold text-[#172B4D]">{t('helpSupport', 'Help & Customer Support')}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => navigateTo('emergency')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-bold text-rose-700">{t('emergencyNotice', '24x7 Emergency Help Hub')}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Logout Button */}
        {!isGuest && (
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('signOut', 'Sign Out of Doctor G')}</span>
          </button>
        )}

        <p className="text-[10px] text-center text-slate-400 pt-2">
          Doctor G Version 1.0.0 (Production Release) • HIPAA Compliant Architecture
        </p>
      </div>

      <LanguageModal isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} />
    </div>
  );
};
