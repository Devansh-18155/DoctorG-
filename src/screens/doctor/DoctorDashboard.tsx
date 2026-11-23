import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  PhoneCall,
  Play,
  SkipForward,
  UserX,
  Pause,
  RotateCcw,
  BarChart3,
  TrendingUp,
  DollarSign,
  Star,
  Settings,
  ChevronRight,
  LogOut,
  Building2,
  Check,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export const DoctorDashboard: React.FC = () => {
  const { user, loginAsPatient, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'queue' | 'appointments' | 'schedule' | 'analytics'>('queue');
  const [currentPatientNumber, setCurrentPatientNumber] = useState(19);
  const [isConsulting, setIsConsulting] = useState(true);
  const [isQueuePaused, setIsQueuePaused] = useState(false);

  // Queue of patients using official Patient Number system (Section 7)
  const [queuePatients, setQueuePatients] = useState([
    { patientNumber: 18, patientNumberStr: '018', name: 'Pooja Verma', age: 45, time: '10:15 AM', status: 'COMPLETED' },
    { patientNumber: 19, patientNumberStr: '019', name: 'Birendra Nath', age: 52, time: '10:30 AM', status: 'IN CONSULTATION' },
    { patientNumber: 20, patientNumberStr: '020', name: 'Rashmi Sen', age: 34, time: '10:45 AM', status: 'NEXT' },
    { patientNumber: 21, patientNumberStr: '021', name: 'Kalyan Bose', age: 61, time: '11:00 AM', status: 'WAITING' },
    { patientNumber: 22, patientNumberStr: '022', name: 'Tanya Mehra', age: 28, time: '11:15 AM', status: 'WAITING' },
    { patientNumber: 23, patientNumberStr: '023', name: 'Farooq Abdullah', age: 41, time: '11:30 AM', status: 'WAITING' },
    { patientNumber: 24, patientNumberStr: '024', name: 'Subhasis Gupta', age: 48, time: '11:45 AM', status: 'WAITING' },
    { patientNumber: 25, patientNumberStr: '025', name: 'Deepak Singhania', age: 56, time: '12:00 PM', status: 'WAITING' },
  ]);

  const patientVolumeData = [
    { day: 'Mon', count: 32 },
    { day: 'Tue', count: 38 },
    { day: 'Wed', count: 42 },
    { day: 'Thu', count: 35 },
    { day: 'Fri', count: 45 },
    { day: 'Sat', count: 28 },
  ];

  const nextPatientNumber = currentPatientNumber + 1;
  const waitingPatientsCount = queuePatients.filter((p) => p.status === 'WAITING' || p.status === 'NEXT').length;

  // Doctor Action 1: Call Next Patient
  const handleCallNext = () => {
    if (isQueuePaused) {
      showToast('Queue is currently paused. Resume queue first.', 'warning');
      return;
    }
    const nextNum = currentPatientNumber + 1;
    setCurrentPatientNumber(nextNum);
    setIsConsulting(true);

    setQueuePatients((prev) =>
      prev.map((p) => {
        if (p.patientNumber === currentPatientNumber) return { ...p, status: 'COMPLETED' };
        if (p.patientNumber === nextNum) return { ...p, status: 'IN CONSULTATION' };
        if (p.patientNumber === nextNum + 1) return { ...p, status: 'NEXT' };
        return p;
      })
    );
    showToast(`Patient Number #${String(nextNum).padStart(3, '0')} called to OPD 03`, 'success');
  };

  // Doctor Action 2: Start Consultation
  const handleStartConsultation = () => {
    setIsConsulting(true);
    setQueuePatients((prev) =>
      prev.map((p) => (p.patientNumber === currentPatientNumber ? { ...p, status: 'IN CONSULTATION' } : p))
    );
    showToast(`Consultation started for Patient Number #${String(currentPatientNumber).padStart(3, '0')}`, 'success');
  };

  // Doctor Action 3: Complete Consultation
  const handleCompleteConsultation = () => {
    setIsConsulting(false);
    setQueuePatients((prev) =>
      prev.map((p) => (p.patientNumber === currentPatientNumber ? { ...p, status: 'COMPLETED' } : p))
    );
    showToast(`Consultation completed for Patient Number #${String(currentPatientNumber).padStart(3, '0')}`, 'info');
  };

  // Doctor Action 4: Skip Patient
  const handleSkip = (num: number) => {
    setQueuePatients((prev) =>
      prev.map((p) => (p.patientNumber === num ? { ...p, status: 'SKIPPED' } : p))
    );
    showToast(`Patient Number #${String(num).padStart(3, '0')} marked as Skipped`, 'info');
  };

  // Doctor Action 5: Mark No-Show
  const handleNoShow = (num: number) => {
    setQueuePatients((prev) =>
      prev.map((p) => (p.patientNumber === num ? { ...p, status: 'NO SHOW' } : p))
    );
    showToast(`Patient Number #${String(num).padStart(3, '0')} marked as No-Show`, 'warning');
  };

  // Doctor Action 6 & 7: Pause / Resume Queue
  const handleTogglePause = () => {
    setIsQueuePaused(!isQueuePaused);
    showToast(
      !isQueuePaused
        ? 'Queue paused. Patients notified of temporary procedural hold.'
        : 'Queue resumed. Consultations proceeding normally.',
      !isQueuePaused ? 'warning' : 'success'
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-[#172B4D]">
              Dr. Arindam Mukherjee — Clinical Chamber Portal
            </h1>
            <p className="text-xs text-slate-500">
              Department of Cardiology • OPD 03 • Apollo Multispeciality Hospital
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loginAsPatient(false)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Switch to Patient App
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80"
              alt="Doctor"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Top 5 Metrics specified in Section 7 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* 1. Current Patient Number */}
          <div className="bg-emerald-50/80 p-4 rounded-2xl border-2 border-emerald-500 shadow-2xs">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Current Patient Number
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-emerald-950">
                {String(currentPatientNumber).padStart(3, '0')}
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full">
                {isConsulting ? 'In Chamber' : 'Waiting Entry'}
              </span>
            </div>
          </div>

          {/* 2. Next Patient Number */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Next Patient Number
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-[#172B4D]">
                {String(nextPatientNumber).padStart(3, '0')}
              </span>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                Next in Line
              </span>
            </div>
          </div>

          {/* 3. Waiting Patients */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Waiting Patients
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-amber-600">
                {waitingPatientsCount}
              </span>
              <span className="text-xs font-bold text-slate-500">In OPD Lobby</span>
            </div>
          </div>

          {/* 4. Total Patients Today */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Patients Today
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-[#172B4D]">38</span>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                18 Completed
              </span>
            </div>
          </div>

          {/* 5. Average Consultation Time */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Avg. Consultation Time
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-slate-700">8.5m</span>
              <span className="text-xs font-bold text-slate-500">Per Patient</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'queue', label: 'Live Queue Terminal', icon: Clock },
            { id: 'appointments', label: 'All Registered Appointments (38)', icon: Calendar },
            { id: 'analytics', label: 'Clinical Analytics', icon: BarChart3 },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === t.id
                    ? 'bg-[#087E8B] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: LIVE QUEUE TERMINAL WITH ALL SPECIFIED DOCTOR ACTIONS */}
        {activeTab === 'queue' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Live Queue Controller with Doctor Actions (Section 7) */}
            <div className="md:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-center">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700">
                  Current Patient in Consultation
                </span>
                <div className="text-6xl font-black text-[#172B4D] my-2">
                  #{String(currentPatientNumber).padStart(3, '0')}
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border inline-block ${
                    isQueuePaused
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : isConsulting
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {isQueuePaused ? 'Queue Paused' : isConsulting ? 'Consultation Active' : 'Chamber Ready for Next Patient'}
                </span>
              </div>

              {/* Doctor Actions (Section 7) */}
              <div className="space-y-2 pt-2 text-left">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                  Doctor Chamber Actions
                </span>

                {/* 1. Call Next Patient */}
                <button
                  onClick={handleCallNext}
                  className="w-full py-3 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl font-bold text-xs shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Play className="w-4 h-4" />
                  <span>Call Next Patient (#{String(nextPatientNumber).padStart(3, '0')})</span>
                </button>

                {/* 2 & 3. Start & Complete Consultation */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleStartConsultation}
                    className="py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Start Consultation</span>
                  </button>

                  <button
                    onClick={handleCompleteConsultation}
                    className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Complete</span>
                  </button>
                </div>

                {/* 4 & 5. Skip & Mark No-Show */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSkip(currentPatientNumber)}
                    className="py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-amber-200 transition-colors"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    <span>Skip Patient</span>
                  </button>

                  <button
                    onClick={() => handleNoShow(currentPatientNumber)}
                    className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-rose-200 transition-colors"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Mark No-Show</span>
                  </button>
                </div>

                {/* 6 & 7. Pause & Resume Queue */}
                <button
                  onClick={handleTogglePause}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors ${
                    isQueuePaused
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>{isQueuePaused ? 'Resume Patient Queue' : 'Pause Patient Queue'}</span>
                </button>
              </div>
            </div>

            {/* Waiting Patients List */}
            <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-[#172B4D]">
                    Active Patient Queue Roster — OPD 03
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sequenced by official Patient Number allocation
                  </p>
                </div>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-xl">
                  {queuePatients.length} Active in Batch
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {queuePatients.map((p) => (
                  <div key={p.patientNumber} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-xs ${
                          p.status === 'IN CONSULTATION'
                            ? 'bg-emerald-600 text-white'
                            : p.status === 'NEXT'
                            ? 'bg-blue-600 text-white'
                            : p.status === 'COMPLETED'
                            ? 'bg-slate-200 text-slate-500'
                            : 'bg-slate-100 text-[#172B4D]'
                        }`}
                      >
                        #{p.patientNumberStr}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#172B4D]">{p.name}</h4>
                        <p className="text-[11px] text-slate-500">
                          {p.age} yrs • Scheduled: {p.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          p.status === 'IN CONSULTATION'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : p.status === 'NEXT'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : p.status === 'COMPLETED'
                            ? 'bg-slate-100 text-slate-500'
                            : p.status === 'SKIPPED'
                            ? 'bg-amber-100 text-amber-800'
                            : p.status === 'NO SHOW'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {p.status}
                      </span>

                      {p.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleCallNext()}
                          className="p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-xs"
                          title="Call this patient"
                        >
                          Call
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPOINTMENTS LIST */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-extrabold text-sm text-[#172B4D] mb-4">
              All Scheduled Consultations for Today
            </h3>
            <div className="divide-y divide-slate-100">
              {queuePatients.map((p) => (
                <div key={p.patientNumber} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-700">#{p.patientNumberStr}</span>
                    <span className="font-bold text-[#172B4D]">{p.name}</span>
                    <span className="text-slate-400">({p.age} yrs)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">{p.time}</span>
                    <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg">
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CLINICAL ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-extrabold text-sm text-[#172B4D] mb-4">
                Weekly Patient Consultation Volume
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={patientVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#087E8B" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-[#172B4D]">
                Consultation Efficiency Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-xs font-semibold text-slate-700">Average Wait Time</span>
                  <span className="text-xs font-extrabold text-teal-700">18.4 mins</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-xs font-semibold text-slate-700">Patient Satisfaction Score</span>
                  <span className="text-xs font-extrabold text-emerald-700">98.2%</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-xs font-semibold text-slate-700">OPD On-Time Start Rate</span>
                  <span className="text-xs font-extrabold text-blue-700">96.0%</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-xs font-semibold text-slate-700">No-Show / Cancellation Rate</span>
                  <span className="text-xs font-extrabold text-amber-700">3.8%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
