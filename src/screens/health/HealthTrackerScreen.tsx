import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  Activity,
  Plus,
  TrendingUp,
  Heart,
  Droplet,
  Flame,
  Footprints,
  Calendar,
  X,
} from 'lucide-react';
import { VitalMeasurement } from '../../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export const HealthTrackerScreen: React.FC = () => {
  const { goBack, vitals, addVitalMeasurement, showToast } = useApp();

  const [selectedVitalType, setSelectedVitalType] = useState<
    'Blood Pressure' | 'Blood Sugar' | 'Heart Rate' | 'Weight' | 'Steps' | 'Water'
  >('Blood Pressure');

  const [isLogOpen, setIsLogOpen] = useState(false);
  const [logValue, setLogValue] = useState('');
  const [logUnit, setLogUnit] = useState('mmHg');

  // Trend Chart Sample Data for the selected vital
  const trendData = [
    { day: 'Mon', value: selectedVitalType === 'Blood Pressure' ? 124 : selectedVitalType === 'Heart Rate' ? 74 : selectedVitalType === 'Blood Sugar' ? 104 : 74.8 },
    { day: 'Tue', value: selectedVitalType === 'Blood Pressure' ? 120 : selectedVitalType === 'Heart Rate' ? 72 : selectedVitalType === 'Blood Sugar' ? 112 : 74.6 },
    { day: 'Wed', value: selectedVitalType === 'Blood Pressure' ? 128 : selectedVitalType === 'Heart Rate' ? 76 : selectedVitalType === 'Blood Sugar' ? 108 : 74.5 },
    { day: 'Thu', value: selectedVitalType === 'Blood Pressure' ? 122 : selectedVitalType === 'Heart Rate' ? 70 : selectedVitalType === 'Blood Sugar' ? 102 : 74.4 },
    { day: 'Fri', value: selectedVitalType === 'Blood Pressure' ? 121 : selectedVitalType === 'Heart Rate' ? 73 : selectedVitalType === 'Blood Sugar' ? 106 : 74.5 },
    { day: 'Sat', value: selectedVitalType === 'Blood Pressure' ? 125 : selectedVitalType === 'Heart Rate' ? 75 : selectedVitalType === 'Blood Sugar' ? 110 : 74.3 },
    { day: 'Sun', value: selectedVitalType === 'Blood Pressure' ? 122 : selectedVitalType === 'Heart Rate' ? 72 : selectedVitalType === 'Blood Sugar' ? 108 : 74.5 },
  ];

  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logValue.trim()) {
      showToast('Please enter measurement reading', 'warning');
      return;
    }
    const num = parseFloat(logValue.split('/')[0]) || 0;
    addVitalMeasurement({
      type: selectedVitalType as any,
      value: logValue,
      numericValue: num,
      unit: logUnit,
      statusTag: 'Normal',
    });
    setIsLogOpen(false);
    setLogValue('');
  };

  const handleSelectType = (t: any, unit: string) => {
    setSelectedVitalType(t);
    setLogUnit(unit);
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

        <span className="text-xs font-bold text-[#172B4D]">Vitals & Health Tracker</span>

        <button
          onClick={() => setIsLogOpen(true)}
          className="flex items-center gap-1 bg-[#087E8B] hover:bg-[#06626D] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Reading</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Metric Selector Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'Blood Pressure', unit: 'mmHg' },
            { id: 'Heart Rate', unit: 'bpm' },
            { id: 'Blood Sugar', unit: 'mg/dL' },
            { id: 'Weight', unit: 'kg' },
            { id: 'Steps', unit: 'steps' },
            { id: 'Water', unit: 'Liters' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectType(item.id, item.unit)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedVitalType === item.id
                  ? 'bg-[#172B4D] text-white shadow-xs font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.id}
            </button>
          ))}
        </div>

        {/* Interactive Trend Chart Hero */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                7-Day Trend
              </span>
              <h3 className="font-extrabold text-sm text-[#172B4D]">{selectedVitalType} History</h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Optimal Stability ✓
            </span>
          </div>

          {/* Recharts Chart Component */}
          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#172B4D',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#087E8B"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#087E8B', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* History Log */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <h4 className="font-bold text-xs text-[#172B4D]">Recent Measurement History</h4>
          <div className="space-y-2">
            {vitals
              .filter((v) => v.type === selectedVitalType)
              .map((vital) => (
                <div
                  key={vital.id}
                  className="p-3 rounded-xl bg-slate-50 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#172B4D] text-sm">{vital.value}</span>
                    <span className="text-[10px] text-slate-500 ml-1">{vital.unit}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{vital.timestamp}</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {vital.statusTag}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Log Measurement Modal */}
      {isLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#172B4D]">Log {selectedVitalType}</h3>
              <button onClick={() => setIsLogOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMeasurement} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Reading Value ({logUnit}) *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={logValue}
                  onChange={(e) => setLogValue(e.target.value)}
                  placeholder={selectedVitalType === 'Blood Pressure' ? 'e.g. 120/80' : 'e.g. 105'}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#087E8B] hover:bg-[#06626D] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Measurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
