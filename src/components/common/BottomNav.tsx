import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  CalendarCheck2,
  HeartPulse,
  Bell,
  User,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    activeBottomTab,
    setActiveBottomTab,
    navigateTo,
    notifications,
    appointments,
    t,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const upcomingCount = appointments.filter((a) => a.bookingStatus === 'UPCOMING').length;

  const navItems = [
    {
      id: 'home' as const,
      label: t('home') || 'Home',
      icon: Home,
      screen: 'home',
    },
    {
      id: 'my-bookings' as const,
      label: t('myBookings') || 'My Bookings',
      icon: CalendarCheck2,
      screen: 'my-bookings',
      badge: upcomingCount > 0 ? upcomingCount : undefined,
    },
    {
      id: 'health' as const,
      label: t('health') || 'Health',
      icon: HeartPulse,
      screen: 'health',
    },
    {
      id: 'notifications' as const,
      label: t('notifications') || 'Notifications',
      icon: Bell,
      screen: 'notifications',
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      id: 'profile' as const,
      label: t('profile') || 'Profile',
      icon: User,
      screen: 'profile',
    },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 fixed bottom-0 left-0 right-0 z-40 max-w-[430px] mx-auto shadow-sheet">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeBottomTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveBottomTab(item.id);
                navigateTo(item.screen);
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#087E8B] font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5px]' : 'stroke-[1.8px]'
                  }`}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold px-1 min-w-[15px] h-[15px] rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight leading-none ${
                  isActive ? 'text-[#087E8B]' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>

              {isActive && (
                <span className="w-1.5 h-1.5 bg-[#087E8B] rounded-full absolute bottom-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
