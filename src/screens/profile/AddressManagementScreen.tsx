import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, Plus, MapPin, Trash2, Home, Briefcase, X } from 'lucide-react';
import { SavedAddress } from '../../types';

export const AddressManagementScreen: React.FC = () => {
  const { goBack, savedAddresses, addAddress, deleteAddress, showToast } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [flat, setFlat] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('Salt Lake Sector 2');
  const [city, setCity] = useState('Kolkata');
  const [pincode, setPincode] = useState('700091');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flat.trim() || !street.trim()) {
      showToast('Please fill flat and street details', 'warning');
      return;
    }
    addAddress({
      label,
      name: 'Subhasis Gupta',
      phone: '+91 98301 54321',
      flat,
      street,
      area,
      city,
      state: 'West Bengal',
      pincode,
      isDefault: false,
    });
    setIsAddOpen(false);
    setFlat('');
    setStreet('');
  };

  return (
    <div className="min-h-full pb-20 bg-[#F6F8FA]">
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-20 flex items-center justify-between shadow-2xs">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Profile</span>
        </button>

        <span className="text-xs font-bold text-[#172B4D]">Saved Addresses</span>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1 bg-[#087E8B] hover:bg-[#06626D] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      <div className="p-4 space-y-3">
        {savedAddresses.map((addr) => (
          <div
            key={addr.id}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2 relative"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                {addr.label}
              </span>
              <button
                onClick={() => deleteAddress(addr.id)}
                className="text-slate-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h4 className="font-bold text-xs text-[#172B4D]">{addr.name} • {addr.phone}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {addr.flat}, {addr.street}, {addr.area}, {addr.city} - {addr.pincode}
            </p>
          </div>
        ))}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#172B4D]">Add Delivery Address</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div className="flex gap-2">
                {(['Home', 'Work', 'Other'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setLabel(t)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      label === t ? 'bg-[#087E8B] text-white' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Flat / House / Building *
                </label>
                <input
                  type="text"
                  required
                  value={flat}
                  onChange={(e) => setFlat(e.target.value)}
                  placeholder="e.g. Flat 3A, Galaxy Apt"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Street / Locality *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. 5th Cross Road"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
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
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
