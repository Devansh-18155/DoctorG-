import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  RotateCw,
  Clock,
  Users,
  AlertCircle,
  Bell,
  CheckCircle2,
  Phone,
  Sparkles,
  Info,
  Building2,
  Check,
  UserCheck,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { OfficialAppointmentStatus } from '../../types';

interface QueuePatientItem {
  patientNumber: number;
  patientNumberStr: string;
  name: string;
  appointmentTime: string;
  isCurrentUser?: boolean;
}

export const LiveQueueScreen: React.FC = () => {
  const { screenParams, appointments, goBack, showToast } = useApp();

  const appointment =
    screenParams?.appointment ||
    appointments.find((a) => a.bookingStatus === 'UPCOMING') ||
    appointments[0];

  // Starting state: current consulting is 19, user patient number is 24 (or from booking)
  const userPatientNum = appointment?.patientNumber || 24;
  const userPatientNumStr = String(userPatientNum).padStart(3, '0');
  const opdChamber = appointment?.opdRoom || 'OPD 03';

  const [currentPatientNum, setCurrentPatientNum] = useState<number>(19);
  const [isConsultationActive, setIsConsultationActive] = useState<boolean>(true);
  const [isQueuePaused, setIsQueuePaused] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('Just now');

  // Roster of patients scheduled around this OPD session
  const [queueRoster, setQueueRoster] = useState<QueuePatientItem[]>([
    { patientNumber: 16, patientNumberStr: '016', name: 'Alok Sengupta', appointmentTime: '09:45 AM' },
    { patientNumber: 17, patientNumberStr: '017', name: 'Manish Kaul', appointmentTime: '10:00 AM' },
    { patientNumber: 18, patientNumberStr: '018', name: 'Pooja Verma', appointmentTime: '10:15 AM' },
    { patientNumber: 19, patientNumberStr: '019', name: 'Birendra Nath', appointmentTime: '10:30 AM' },
    { patientNumber: 20, patientNumberStr: '020', name: 'Rashmi Sen', appointmentTime: '10:45 AM' },
    { patientNumber: 21, patientNumberStr: '021', name: 'Kalyan Bose', appointmentTime: '11:00 AM' },
    { patientNumber: 22, patientNumberStr: '022', name: 'Tanya Mehra', appointmentTime: '11:15 AM' },
    { patientNumber: 23, patientNumberStr: '023', name: 'Farooq Abdullah', appointmentTime: '11:30 AM' },
    { patientNumber: 24, patientNumberStr: userPatientNumStr, name: appointment?.patientName || 'Subhasis Gupta (You)', appointmentTime: appointment?.timeSlot || '11:45 AM', isCurrentUser: true },
    { patientNumber: 25, patientNumberStr: '025', name: 'Deepak Singhania', appointmentTime: '12:00 PM' },
    { patientNumber: 26, patientNumberStr: '026', name: 'Surajita Mallick', appointmentTime: '12:15 PM' },
  ]);

  // Derived Queue Metrics
  const nextPatientNum = currentPatientNum + 1;
  const patientsAhead = Math.max(0, userPatientNum - currentPatientNum);
  const estimatedWaitMinutes = Math.max(0, patientsAhead * 6); // approx 6 mins per patient

  // Official Status Evaluation (Section 4)
  let officialStatus: OfficialAppointmentStatus = 'Waiting';
  if (currentPatientNum > userPatientNum) {
    officialStatus = 'Completed';
  } else if (currentPatientNum === userPatientNum) {
    officialStatus = isConsultationActive ? 'In Consultation' : 'Please Proceed to OPD';
  } else if (patientsAhead === 1) {
    officialStatus = 'Your Turn Approaching';
  } else if (patientsAhead <= 3) {
    officialStatus = 'Your Turn Approaching';
  } else {
    officialStatus = 'Waiting';
  }

  // Hospital notification banner text (Section 5)
  const getQueueNotificationMessage = () => {
    if (isQueuePaused) {
      return {
        text: 'The doctor is currently attending to an urgent clinical procedure. Queue paused temporarily.',
        type: 'warning',
      };
    }
    if (currentPatientNum === userPatientNum) {
      return {
        text: `Your Patient Number ${userPatientNumStr} has been called. Please proceed immediately to ${opdChamber}.`,
        type: 'called',
      };
    }
    if (patientsAhead === 1) {
      return {
        text: 'You are next in line. Please be ready for your consultation at the waiting lobby.',
        type: 'next',
      };
    }
    if (patientsAhead <= 3) {
      return {
        text: 'Your appointment is approaching. Please remain near the clinic chamber.',
        type: 'approaching',
      };
    }
    return {
      text: `Your consultation is scheduled at ${appointment?.timeSlot || '11:45 AM'}. Please arrive 15 minutes before your scheduled appointment.`,
      type: 'info',
    };
  };

  const currentNotification = getQueueNotificationMessage();

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshedTime('Just now');
      showToast('Queue status verified with clinic reception terminal', 'info');
    }, 600);
  };

  // Doctor Simulator Actions (Section 7)
  const handleCallNextPatient = () => {
    if (isQueuePaused) {
      showToast('Queue is currently paused. Resume queue before calling next patient.', 'warning');
      return;
    }
    const nextNum = currentPatientNum + 1;
    setCurrentPatientNum(nextNum);
    setIsConsultationActive(true);

    if (nextNum === userPatientNum) {
      showToast(
        `🔔 YOUR PATIENT NUMBER ${userPatientNumStr} IS CALLED! Please proceed to ${opdChamber}.`,
        'success'
      );
    } else {
      showToast(`Patient Number #${String(nextNum).padStart(3, '0')} called into ${opdChamber}`, 'info');
    }
  };

  const handleStartConsultation = () => {
    setIsConsultationActive(true);
    showToast(`Consultation started for Patient Number #${String(currentPatientNum).padStart(3, '0')}`, 'success');
  };

  const handleCompleteConsultation = () => {
    setIsConsultationActive(false);
    showToast(`Consultation marked as Completed for Patient #${String(currentPatientNum).padStart(3, '0')}`, 'info');
  };

  const handleSkipPatient = () => {
    const nextNum = currentPatientNum + 1;
    setCurrentPatientNum(nextNum);
    showToast(`Patient Number #${String(currentPatientNum).padStart(3, '0')} marked as Skipped / Absent`, 'warning');
  };

  return (
    <div className="min-h-full pb-24 bg-[#F6F8FA]">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/90 p-4 sticky top-0 z-30 flex items-center justify-between shadow-2xs">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Appointment</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-black text-[#172B4D] tracking-tight block">
            LIVE PATIENT QUEUE
          </span>
          <span className="text-[10px] text-teal-700 font-bold block">
            {appointment?.hospitalName || 'Apollo Multispeciality Hospital'}
          </span>
        </div>

        <button
          onClick={handleManualRefresh}
          className={`p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors ${
            isRefreshing ? 'animate-spin text-teal-600' : ''
          }`}
          title="Refresh Queue Terminal"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Dynamic Patient Queue Progress Notification Banner (Section 5) */}
        <div
          className={`p-3.5 rounded-2xl border flex items-start gap-3 shadow-xs animate-in fade-in transition-all ${
            currentNotification.type === 'called'
              ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-400'
              : currentNotification.type === 'next'
              ? 'bg-blue-50 text-blue-900 border-blue-300'
              : currentNotification.type === 'approaching'
              ? 'bg-amber-50 text-amber-900 border-amber-300'
              : currentNotification.type === 'warning'
              ? 'bg-rose-50 text-rose-900 border-rose-300'
              : 'bg-teal-50 text-teal-900 border-teal-200'
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {currentNotification.type === 'called' ? (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
            ) : currentNotification.type === 'next' ? (
              <ArrowRight className="w-4 h-4 text-blue-700" />
            ) : currentNotification.type === 'approaching' ? (
              <Clock className="w-4 h-4 text-amber-700" />
            ) : (
              <Info className="w-4 h-4 text-teal-700" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-80">
              {currentNotification.type === 'called'
                ? 'Official OPD Call Alert'
                : currentNotification.type === 'next'
                ? 'Queue Alert: Next In Line'
                : currentNotification.type === 'approaching'
                ? 'Queue Alert: Turn Approaching'
                : 'Hospital Queue Advisory'}
            </span>
            <p className="text-xs font-bold leading-snug mt-0.5">{currentNotification.text}</p>
          </div>
        </div>

        {/* 4 Official Metrics Cards (Section 3) */}
        <div className="grid grid-cols-2 gap-3">
          {/* 1. YOUR PATIENT NUMBER */}
          <div className="bg-[#172B4D] text-white p-4 rounded-3xl shadow-sm border border-slate-800 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-300">
                Your Patient Number
              </span>
              <span className="text-[9px] font-extrabold bg-teal-500/30 text-teal-200 px-2 py-0.5 rounded-full border border-teal-400/40">
                YOU
              </span>
            </div>
            <div className="my-2">
              <span className="text-4xl font-black text-white tracking-tight">
                {userPatientNumStr}
              </span>
            </div>
            <div className="text-[10px] text-slate-300 font-medium">
              Chamber: <strong className="text-white">{opdChamber}</strong>
            </div>
          </div>

          {/* 2. CURRENTLY CONSULTING */}
          <div className="bg-emerald-50 text-emerald-950 p-4 rounded-3xl shadow-sm border-2 border-emerald-500 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Currently Consulting
              </span>
            </div>
            <div className="my-2">
              <span className="text-4xl font-black text-emerald-950 tracking-tight">
                {String(currentPatientNum).padStart(3, '0')}
              </span>
            </div>
            <div className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
              <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded text-[9px] uppercase font-extrabold">
                {isConsultationActive ? 'IN CONSULTATION' : 'Awaiting Entry'}
              </span>
            </div>
          </div>

          {/* 3. NEXT PATIENT */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Next Patient
            </span>
            <div className="my-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#172B4D]">
                {String(nextPatientNum).padStart(3, '0')}
              </span>
              <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                NEXT
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Scheduled: 10:45 AM</span>
          </div>

          {/* 4. PATIENTS AHEAD & ESTIMATED WAITING TIME */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Patients Ahead
            </span>
            <div className="my-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-700">
                {patientsAhead}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Patients</span>
            </div>
            <span className="text-[10px] font-bold text-teal-800">
              ~{estimatedWaitMinutes} mins waiting time
            </span>
          </div>
        </div>

        {/* Doctor & Consultation Chamber Details Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-start gap-3">
              <img
                src={appointment?.doctorImage || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'}
                alt={appointment?.doctorName}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
              />
              <div>
                <h4 className="font-extrabold text-xs text-[#172B4D]">
                  {appointment?.doctorName || 'Dr. Arindam Mukherjee'}
                </h4>
                <p className="text-[11px] text-teal-700 font-semibold">
                  {appointment?.department || 'Cardiology'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {appointment?.hospitalName || 'Apollo Multispeciality Hospital'}
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 inline-block">
                {officialStatus}
              </span>
              <p className="text-[10px] text-slate-400 mt-1">Updated: {lastRefreshedTime}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 text-xs text-slate-600">
            <div>
              <span className="text-[10px] text-slate-400 block">Appointment Time:</span>
              <span className="font-bold text-[#172B4D]">
                {appointment?.date || '2026-11-20'} • {appointment?.timeSlot || '04:30 PM'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Consultation Room:</span>
              <span className="font-extrabold text-teal-800">{opdChamber}</span>
            </div>
          </div>
        </div>

        {/* Hospital Digital Queue Display (Section 3 & 4) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-xs text-[#172B4D] uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                <span>Patient Queue Display</span>
              </h3>
              <p className="text-[10px] text-slate-400">Official digital sequence for {opdChamber}</p>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
              {queueRoster.length} Scheduled
            </span>
          </div>

          {/* Queue List Roster */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {queueRoster.map((patient) => {
              const isCompleted = patient.patientNumber < currentPatientNum;
              const isCurrent = patient.patientNumber === currentPatientNum;
              const isNext = patient.patientNumber === nextPatientNum;
              const isUser = patient.patientNumber === userPatientNum;
              const isApproaching = patient.patientNumber > currentPatientNum && patient.patientNumber <= currentPatientNum + 3 && !isNext;

              return (
                <div
                  key={patient.patientNumber}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isUser
                      ? 'bg-slate-900 text-white border-slate-800 shadow-md ring-2 ring-teal-500'
                      : isCurrent
                      ? 'bg-emerald-50/90 border-emerald-400 ring-1 ring-emerald-400 shadow-xs'
                      : isNext
                      ? 'bg-blue-50/70 border-blue-300'
                      : isApproaching
                      ? 'bg-amber-50/50 border-amber-200'
                      : isCompleted
                      ? 'bg-slate-50 text-slate-400 border-slate-100 opacity-60'
                      : 'bg-white border-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Patient Number Box */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                        isUser
                          ? 'bg-teal-500 text-white'
                          : isCurrent
                          ? 'bg-emerald-600 text-white'
                          : isNext
                          ? 'bg-blue-600 text-white'
                          : isCompleted
                          ? 'bg-slate-200 text-slate-500'
                          : 'bg-slate-100 text-[#172B4D]'
                      }`}
                    >
                      {patient.patientNumberStr}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5
                          className={`font-bold text-xs ${
                            isUser ? 'text-white' : isCompleted ? 'text-slate-400 line-through' : 'text-[#172B4D]'
                          }`}
                        >
                          {patient.name}
                        </h5>
                        {isUser && (
                          <span className="text-[9px] font-black bg-teal-400 text-slate-900 px-1.5 py-0.2 rounded-full">
                            YOU
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[10px] ${
                          isUser ? 'text-slate-300' : 'text-slate-400'
                        }`}
                      >
                        Appointment Time: {patient.appointmentTime}
                      </p>
                    </div>
                  </div>

                  {/* Right Status Badge */}
                  <div className="text-right flex-shrink-0">
                    {isCompleted ? (
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5 justify-end">
                        <Check className="w-3 h-3 text-slate-400" />
                        <span>Completed</span>
                      </span>
                    ) : isCurrent ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-600 text-white flex items-center gap-1 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        <span>IN CONSULTATION</span>
                      </span>
                    ) : isNext ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-600 text-white">
                        NEXT
                      </span>
                    ) : isApproaching ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Approaching
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400">
                        Waiting
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Doctor & Clinic Actions Simulator (Section 7) */}
        <div className="bg-slate-100 rounded-3xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>OPD Chamber Console (Demonstration Simulator)</span>
            </span>
            <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-bold">
              Demo Test
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCallNextPatient}
              className="py-2.5 px-3 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Call Next Patient (+1)
            </button>
            <button
              onClick={handleStartConsultation}
              className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Start Consultation
            </button>
            <button
              onClick={handleCompleteConsultation}
              className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Complete Consultation
            </button>
            <button
              onClick={() => {
                setIsQueuePaused(!isQueuePaused);
                showToast(`Queue is now ${!isQueuePaused ? 'Paused' : 'Resumed'}`, 'info');
              }}
              className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              {isQueuePaused ? 'Resume Queue' : 'Pause Queue'}
            </button>
          </div>

          <p className="text-[10px] text-slate-400 text-center">
            In hospital production, patient number increments are triggered exclusively from the verified doctor chamber terminal.
          </p>
        </div>

        {/* Hospital Contact Helpdesk */}
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
          <div>
            <h5 className="font-bold text-slate-800">Hospital OPD Enquiry Desk</h5>
            <p className="text-[10px] text-slate-400">Chamber: {opdChamber} • Reception: +91 33 2320 3040</p>
          </div>
          <a
            href="tel:+913323203040"
            className="p-2 bg-teal-50 text-teal-700 rounded-xl hover:bg-teal-100 font-bold"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
