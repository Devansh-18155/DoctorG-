import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  Clock,
  Plus,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trash2,
  X,
  Bell,
  Sparkles,
  Pill,
} from 'lucide-react';
import { MedicineReminder } from '../../types';

export const MedicineReminderScreen: React.FC = () => {
  const {
    goBack,
    medicineReminders,
    toggleReminderTaken,
    addMedicineReminder,
    deleteMedicineReminder,
    showConfirmDialog,
    showToast,
  } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet');
  const [instructions, setInstructions] = useState<'Before Food' | 'After Food' | 'With Food' | 'Empty Stomach'>('After Food');
  const [frequency, setFrequency] = useState<'Once Daily' | 'Twice Daily' | 'Three Times Daily' | 'As Needed'>('Once Daily');
  const [time1, setTime1] = useState('08:30 AM');

  // Daily progress calculation
  const totalDosesToday = medicineReminders.reduce((acc, r) => acc + r.timeSlots.length, 0);
  const takenDosesToday = medicineReminders.reduce(
    (acc, r) => acc + r.takenToday.filter((t) => t).length,
    0
  );
  const progressPercent = totalDosesToday > 0 ? Math.round((takenDosesToday / totalDosesToday) * 100) : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) {
      showToast('Please enter medicine name', 'warning');
      return;
    }
    addMedicineReminder({
      medicineName: medName,
      dosage,
      instructions,
      frequency,
      timeSlots: [time1],
      startDate: '2026-11-20',
      endDate: '2026-12-31',
      status: 'ACTIVE',
    });
    setIsAddOpen(false);
    setMedName('');
    showToast('Reminder added successfully!', 'success');
  };

  const handleDelete = (id: string, name: string) => {
    showConfirmDialog({
      title: 'Delete Reminder?',
      message: `Delete reminder schedule for ${name}?`,
      confirmLabel: 'Delete',
      isDestructive: true,
      onConfirm: () => deleteMedicineReminder(id),
    });
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
          <span>Health</span>
        </button>

        <span className="text-xs font-bold text-[#172B4D]">Daily Medicine Reminders</span>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1 bg-[#087E8B] hover:bg-[#06626D] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Daily Progress Tracker Card */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-4 text-white shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Today's Adherence
              </span>
              <h3 className="font-extrabold text-base text-white mt-0.5">
                {takenDosesToday} of {totalDosesToday} Doses Taken
              </h3>
            </div>
            <span className="text-2xl font-black text-white">{progressPercent}%</span>
          </div>

          <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Reminders List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Dose Schedule
          </h4>

          {medicineReminders.map((rem) => (
            <div
              key={rem.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#172B4D]">{rem.medicineName}</h4>
                    <p className="text-[11px] text-teal-700 font-semibold">{rem.dosage}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {rem.instructions} • {rem.frequency}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(rem.id, rem.medicineName)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Time slots and Taken Actions */}
              <div className="space-y-2">
                {rem.timeSlots.map((slot, sIdx) => {
                  const isTaken = rem.takenToday[sIdx];
                  return (
                    <div
                      key={slot}
                      className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <span className="font-bold text-[#172B4D]">{slot}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            showToast(`Snoozed ${rem.medicineName} for 15 minutes`, 'info');
                          }}
                          className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-[10px] font-semibold text-slate-600"
                        >
                          Snooze
                        </button>
                        <button
                          onClick={() => toggleReminderTaken(rem.id, sIdx)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                            isTaken
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white border border-slate-300 text-slate-700 hover:border-emerald-500'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isTaken ? 'Taken ✓' : 'Mark Taken'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Reminder Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#172B4D]">Add Medicine Reminder</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  required
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  placeholder="e.g. Telma 40mg"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="1 Tablet / 5ml"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Timing</label>
                  <select
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  >
                    <option value="After Food">After Food</option>
                    <option value="Before Food">Before Food</option>
                    <option value="With Food">With Food</option>
                    <option value="Empty Stomach">Empty Stomach</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Reminder Time</label>
                <input
                  type="text"
                  value={time1}
                  onChange={(e) => setTime1(e.target.value)}
                  placeholder="e.g. 08:30 AM"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#087E8B] hover:bg-[#06626D] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
