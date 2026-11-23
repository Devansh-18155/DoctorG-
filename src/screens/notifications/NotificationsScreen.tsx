import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Calendar,
  Clock,
  FlaskConical,
  Package,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { AppNotification } from '../../types';

export const NotificationsScreen: React.FC = () => {
  const {
    goBack,
    navigateTo,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    showToast,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = [
    'All',
    'Appointments',
    'Queue updates',
    'Medicine reminders',
    'Orders',
    'Lab reports',
  ];

  const filtered = notifications.filter(
    (n) => activeFilter === 'All' || n.category === activeFilter
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Appointments':
        return Calendar;
      case 'Queue updates':
        return Activity;
      case 'Medicine reminders':
        return Clock;
      case 'Orders':
        return Package;
      case 'Lab reports':
        return FlaskConical;
      default:
        return Bell;
    }
  };

  const handleNotificationClick = (item: AppNotification) => {
    markNotificationAsRead(item.id);
    if (item.actionDestination) {
      if (item.actionDestination === 'live-queue') {
        navigateTo('live-queue');
      } else if (item.actionDestination === 'appointment-details') {
        navigateTo('my-bookings');
      } else if (item.actionDestination === 'reminders') {
        navigateTo('reminders');
      } else if (item.actionDestination === 'health-records') {
        navigateTo('health-records');
      } else if (item.actionDestination === 'medical-store') {
        navigateTo('medical-store');
      }
    }
  };

  return (
    <div className="min-h-full pb-20 bg-[#F6F8FA]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-20 flex items-center justify-between shadow-2xs">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <span className="text-xs font-bold text-[#172B4D]">Notifications Center</span>

        <button
          onClick={markAllNotificationsAsRead}
          className="text-xs font-bold text-[#087E8B] hover:underline flex items-center gap-1"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark all read</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Filter chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === c
                  ? 'bg-[#172B4D] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Notifications list */}
        <div className="space-y-2.5">
          {filtered.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-[#172B4D]">No notifications</h4>
              <p className="text-xs text-slate-400 mt-1">You're completely up to date!</p>
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = getCategoryIcon(item.category);
              return (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    item.read
                      ? 'bg-white border-slate-200 opacity-90'
                      : 'bg-teal-50/40 border-teal-200 shadow-xs'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      item.read
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-[#087E8B] text-white shadow-xs'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-[#172B4D]">{item.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">{item.message}</p>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.2 rounded mt-1.5 inline-block">
                      {item.category}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(item.id);
                    }}
                    className="text-slate-300 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
