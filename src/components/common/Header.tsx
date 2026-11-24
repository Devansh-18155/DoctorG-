import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Bell,
  Globe,
  ChevronDown,
  User,
  HeartHandshake,
} from 'lucide-react';
import { formatLocationName } from '../../utils/locationHelper';

interface HeaderProps {
  onOpenLanguage?: () => void;
  onOpenLocation?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLanguage, onOpenLocation }) => {
  const {
    user,
    isGuest,
    currentCity,
    currentArea,
    isLiveLocation,
    isDetectingLocation,
    detectLiveLocation,
    notifications,
    navigateTo,
    currentLanguage,
    t,
  } = useApp();

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="bg-white border-b border-slate-100 px-4 pt-3 pb-3 sticky top-0 z-30 shadow-xs">
      {/* Top row: Brand + Emergency SOS + Language + Notifications + Avatar */}
      <div className="flex items-center justify-between gap-2">
        {/* Brand & Logo - Official Doctor G Brand Logo */}
        <div
          onClick={() => navigateTo('home')}
          className="flex items-center gap-1.5 cursor-pointer group select-none"
        >
          <img
            src="/doctor-g-logo.jpg"
            alt="Doctor G - Your Healthcare Partner"
            className="h-10 sm:h-11 w-auto max-w-[140px] object-contain rounded-lg group-hover:scale-102 transition-transform"
          />
          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex-shrink-0 self-center">
            {t('live', 'Live')}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {/* Language selector button */}
          <button
            onClick={onOpenLanguage}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors relative"
            title={t('selectLanguage', 'Select Language')}
          >
            <Globe className="w-4 h-4 text-slate-700" />
            <span className="absolute -bottom-0.5 -right-0.5 bg-teal-600 text-white text-[9px] font-bold px-1 rounded-full uppercase leading-tight">
              {currentLanguage}
            </span>
          </button>

          {/* Notifications bell */}
          <button
            onClick={() => navigateTo('notifications')}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors relative"
            title={t('notifications', 'Notifications')}
          >
            <Bell className="w-4 h-4 text-slate-700" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Profile avatar */}
          <button
            onClick={() => navigateTo('profile')}
            className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-100 hover:ring-2 hover:ring-teal-500 transition-all ml-0.5"
            title={t('profile', 'Profile & Settings')}
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Second row: Greeting & Location selector */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-50 text-xs">
        <div>
          <span className="text-slate-400">{t('hello', 'Hello')}, </span>
          <span className="font-bold text-[#172B4D]">
            {isGuest ? t('guestUser', 'Guest User') : user?.name.split(' ')[0] || 'User'}
          </span>
          <span className="ml-1 text-slate-400">👋</span>
        </div>

        {/* Location Dropdown trigger */}
        <button
          onClick={onOpenLocation}
          className="flex items-center gap-1.5 text-slate-700 hover:text-teal-800 bg-teal-50/70 hover:bg-teal-100/60 px-2.5 py-1 rounded-full border border-teal-200/80 transition-all shadow-2xs group"
          title="Click to view live GPS details or change city"
        >
          {isDetectingLocation ? (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          ) : isLiveLocation ? (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          ) : (
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
          )}

          <div className="flex flex-col items-start leading-tight text-left">
            <span className="text-[9px] uppercase font-extrabold text-teal-700 tracking-wider">
              {isDetectingLocation ? t('locating', 'Locating...') : isLiveLocation ? t('liveGpsLocation', 'Live GPS Location') : t('location', 'Location')}
            </span>
            <span className="font-bold text-[11px] text-[#172B4D] max-w-[140px] truncate">
              {formatLocationName(currentArea, currentCity)}
            </span>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-teal-700 transition-colors ml-0.5" />
        </button>
      </div>
    </div>
  );
};
