import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  QrCode,
  Download,
  Share2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  AlertTriangle,
  RotateCcw,
  XCircle,
  Building2,
  ChevronRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AppointmentDetailsScreen: React.FC = () => {
  const {
    appointments,
    screenParams,
    goBack,
    navigateTo,
    cancelAppointment,
    rescheduleAppointment,
    showConfirmDialog,
    showToast,
  } = useApp();

  const appointmentId = screenParams?.appointmentId || appointments[0]?.id;
  const appointment =
    appointments.find((a) => a.id === appointmentId) || appointments[0];

  // Reschedule Modal State
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('2026-11-25');
  const [rescheduleSlot, setRescheduleSlot] = useState('05:30 PM');

  // Hospital Map Modal State
  const [isMapOpen, setIsMapOpen] = useState(false);

  if (!appointment) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm font-bold text-slate-700">Appointment not found.</p>
        <button onClick={goBack} className="mt-3 text-xs text-teal-600 font-bold">
          Go Back
        </button>
      </div>
    );
  }

  const handleCancel = () => {
    showConfirmDialog({
      title: 'Cancel Appointment?',
      message:
        'Are you sure you want to cancel this appointment? As per policy, 100% refund will be processed within 24-48 hours to your payment method.',
      confirmLabel: 'Yes, Cancel Booking',
      isDestructive: true,
      onConfirm: () => {
        cancelAppointment(appointment.id);
      },
    });
  };

  const handleApplyReschedule = () => {
    rescheduleAppointment(appointment.id, rescheduleDate, rescheduleSlot);
    setIsRescheduleOpen(false);
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
          <span>My Bookings</span>
        </button>

        <span className="text-xs font-bold text-[#172B4D]">Official Digital Appointment Slip</span>

        <StatusBadge status={appointment.bookingStatus} />
      </div>

      <div className="p-4 space-y-4">
        {/* Live Queue Banner if Upcoming */}
        {appointment.bookingStatus === 'UPCOMING' && (
          <div
            onClick={() => navigateTo('live-queue', { appointment })}
            className="p-3.5 bg-gradient-to-r from-teal-700 to-[#172B4D] rounded-2xl text-white shadow-md flex items-center justify-between cursor-pointer hover:shadow-lg transition-all"
          >
            <div>
              <div className="flex items-center gap-1.5 text-teal-300 text-[10px] font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Live Hospital Queue Active</span>
              </div>
              <h4 className="font-bold text-xs text-white mt-0.5">
                Current Patient: #{appointment.currentToken ? String(appointment.currentToken).padStart(3, '0') : '019'} ({appointment.opdRoom || 'OPD 03'})
              </h4>
              <p className="text-[11px] text-teal-100 mt-0.5">
                Your Patient Number: #{appointment.patientNumberStr || String(appointment.patientNumber || appointment.tokenNumber).padStart(3, '0')} • Approx. {appointment.estimatedWaitMinutes} mins wait
              </p>
            </div>
            <button className="px-3 py-1.5 bg-white text-teal-800 font-bold text-xs rounded-xl shadow-xs flex-shrink-0">
              Track Queue
            </button>
          </div>
        )}

        {/* Official Digital Appointment Slip */}
        <div className="bg-white rounded-3xl border border-teal-200/90 shadow-sm p-5 relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Booking ID: {appointment.bookingId}
              </span>
              <h3 className="font-extrabold text-sm text-[#172B4D] mt-0.5">
                {appointment.doctorName}
              </h3>
              <p className="text-xs text-teal-700 font-semibold">{appointment.doctorSpecialty}</p>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col items-center justify-center text-teal-800 shadow-2xs">
              <span className="text-[9px] uppercase font-bold tracking-tight text-teal-600">Patient No</span>
              <span className="text-base font-black leading-none mt-0.5">#{appointment.patientNumberStr || String(appointment.patientNumber || appointment.tokenNumber).padStart(3, '0')}</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="py-3 space-y-2.5 border-b border-dashed border-slate-200 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Hospital / Clinic</span>
              <span className="font-bold text-[#172B4D] text-right max-w-[200px] truncate">
                {appointment.hospitalName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Department</span>
              <span className="font-semibold text-slate-700">{appointment.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Consultation Room / OPD</span>
              <span className="font-bold text-[#172B4D]">{appointment.opdRoom || 'OPD 03'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date & Scheduled Time</span>
              <span className="font-bold text-[#172B4D]">
                {appointment.date} at {appointment.timeSlot}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Consultation Status</span>
              <span className="font-bold text-teal-700">
                {appointment.officialStatus || 'Confirmed'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Patient</span>
              <span className="font-bold text-[#172B4D]">
                {appointment.patientName} ({appointment.patientAge}y, {appointment.patientGender})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Status</span>
              <span className="font-bold text-emerald-600">
                ₹{appointment.fee} ({appointment.paymentStatus})
              </span>
            </div>
          </div>

          {/* QR Code and Check-in info */}
          <div className="pt-3 flex items-center justify-between">
            <div className="max-w-[200px]">
              <p className="text-[11px] font-bold text-slate-700">Digital Entry QR</p>
              <p className="text-[10px] text-slate-400 leading-snug mt-0.5">
                Show this barcode at the reception kiosk for instant OPD verification.
              </p>
            </div>
            <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-xl p-1.5 flex items-center justify-center">
              <QrCode className="w-12 h-12 text-slate-800" />
            </div>
          </div>
        </div>

        {/* Action Buttons: Download & Share Slip */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => showToast('Official appointment slip saved to gallery', 'success')}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs hover:bg-slate-50"
          >
            <Download className="w-4 h-4 text-teal-600" />
            <span>Download Slip</span>
          </button>
          <button
            onClick={() => showToast('Appointment details copied to clipboard', 'info')}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs hover:bg-slate-50"
          >
            <Share2 className="w-4 h-4 text-teal-600" />
            <span>Share Slip</span>
          </button>
        </div>

        {/* Hospital Location & Map Trigger */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
          <h4 className="font-bold text-xs text-[#172B4D] flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-teal-700" />
            <span>Hospital Contact & Address</span>
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">{appointment.hospitalAddress}</p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setIsMapOpen(true)}
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>View Map</span>
            </button>
            <a
              href="tel:+913323203040"
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
            >
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              <span>Call Hospital</span>
            </a>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
          <h5 className="font-bold text-[#172B4D]">Important Instructions:</h5>
          <p className="font-semibold text-teal-900">• Please arrive 15 minutes before your scheduled appointment.</p>
          <p>• Carry any past medical records, prescriptions, and a government photo ID.</p>
          <p>• Wear a protective mask inside hospital outpatient waiting zones.</p>
        </div>

        {/* Reschedule & Cancel Options (if upcoming) */}
        {appointment.bookingStatus === 'UPCOMING' && (
          <div className="pt-2 flex gap-2">
            <button
              onClick={() => setIsRescheduleOpen(true)}
              className="flex-1 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-teal-600" />
              <span>Reschedule</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel Booking</span>
            </button>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {isRescheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom">
            <h3 className="font-bold text-sm text-[#172B4D] mb-1">Reschedule Appointment</h3>
            <p className="text-xs text-slate-500 mb-4">
              Select a new date and time slot for {appointment.doctorName}
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">New Date</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">New Slot</label>
                <select
                  value={rescheduleSlot}
                  onChange={(e) => setRescheduleSlot(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="04:30 PM">04:30 PM</option>
                  <option value="05:30 PM">05:30 PM</option>
                  <option value="06:30 PM">06:30 PM</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsRescheduleOpen(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyReschedule}
                  className="flex-1 py-2.5 bg-[#087E8B] hover:bg-[#06626D] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Confirm Change
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hospital Map Simulation Modal */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <h3 className="font-bold text-sm text-[#172B4D] mb-1">Hospital Location Map</h3>
            <p className="text-xs text-slate-500 mb-3">{appointment.hospitalName}</p>
            <div className="h-48 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
                alt="Map"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute p-2 bg-white rounded-xl shadow-lg border border-slate-200 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600 animate-bounce" />
                <span className="text-xs font-bold text-slate-800">{appointment.hospitalName}</span>
              </div>
            </div>
            <button
              onClick={() => setIsMapOpen(false)}
              className="w-full mt-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
            >
              Close Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
