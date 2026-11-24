import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Check,
  Compass,
  Copy,
  CheckCheck,
  Building2,
  Navigation,
  RotateCcw,
} from 'lucide-react';
import { DoctorMap, MapCoordinates } from './DoctorMap';
import { CITIES_DATA } from '../../data/cityData';
import { VoiceSearchInput } from '../common/VoiceSearchInput';

interface DoctorLocationPickerProps {
  initialCoordinates?: MapCoordinates;
  initialAddress?: string;
  initialCity?: string;
  onSaveLocation: (coords: MapCoordinates, addressInfo?: { address: string; city: string }) => void;
  onCancel?: () => void;
}

export const DoctorLocationPicker: React.FC<DoctorLocationPickerProps> = ({
  initialCoordinates = { lat: 22.5802, lng: 88.4357 },
  initialAddress = 'Sector V, Salt Lake, Kolkata',
  initialCity = 'Kolkata',
  onSaveLocation,
  onCancel,
}) => {
  const [selectedCoords, setSelectedCoords] = useState<MapCoordinates>(initialCoordinates);
  const [addressSearch, setAddressSearch] = useState(initialAddress);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [isCopied, setIsCopied] = useState(false);
  const [manualLat, setManualLat] = useState(initialCoordinates.lat.toString());
  const [manualLng, setManualLng] = useState(initialCoordinates.lng.toString());

  // Handle location update from map click or marker drag
  const handleCoordsChange = (coords: MapCoordinates) => {
    const rounded = {
      lat: Math.round(coords.lat * 100000) / 100000,
      lng: Math.round(coords.lng * 100000) / 100000,
    };
    setSelectedCoords(rounded);
    setManualLat(rounded.lat.toString());
    setManualLng(rounded.lng.toString());
  };

  // Search Address / Landmark preset coordinates
  const handleAddressSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = addressSearch.toLowerCase().trim();

    // Look for matching locality in CITIES_DATA
    for (const city of CITIES_DATA) {
      if (city.name.toLowerCase().includes(q) || q.includes(city.name.toLowerCase())) {
        setSelectedCoords({ lat: city.lat, lng: city.lng });
        setSelectedCity(city.name);
        setManualLat(city.lat.toString());
        setManualLng(city.lng.toString());
        return;
      }
      for (const loc of city.localities) {
        if (loc.name.toLowerCase().includes(q) || loc.pincode === q) {
          setSelectedCoords({ lat: loc.lat, lng: loc.lng });
          setSelectedCity(city.name);
          setManualLat(loc.lat.toString());
          setManualLng(loc.lng.toString());
          return;
        }
      }
    }
  };

  const handleApplyManual = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      setSelectedCoords({ lat, lng });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${selectedCoords.lat}, ${selectedCoords.lng}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl flex flex-col">
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">Clinic Location Map Picker</h3>
            <p className="text-[11px] text-slate-400">
              Click anywhere on map or drag pin to assign precise OPD latitude & longitude
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="text-xs font-semibold text-slate-400 hover:text-white px-2 py-1 rounded-lg"
          >
            Close
          </button>
        )}
      </div>

      {/* Address Search Form with Reusable Voice Search */}
      <form onSubmit={handleAddressSearch} className="p-3 bg-slate-50 border-b border-slate-200 flex gap-2 items-center">
        <div className="flex-1">
          <VoiceSearchInput
            placeholder="Search clinic address, locality or PIN (e.g. Salt Lake Sector V)..."
            value={addressSearch}
            onChange={(e) => setAddressSearch(e.target.value)}
            onChangeValue={setAddressSearch}
            onClear={() => setAddressSearch('')}
            onSearch={() => handleAddressSearch({ preventDefault: () => {} } as any)}
            searchCategory="location"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Locate
        </button>
      </form>

      {/* Interactive Map with Draggable Pin */}
      <div className="relative h-72 w-full">
        <DoctorMap
          center={selectedCoords}
          zoom={14}
          isPickerMode={true}
          pickerCoordinates={selectedCoords}
          onPickerChange={handleCoordsChange}
          height="100%"
          showSearchAreaBtn={false}
        />

        <div className="absolute top-2 left-2 z-30 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-xl shadow-xs border border-slate-200 text-[10px] font-bold text-slate-700 pointer-events-none">
          👆 Click anywhere on the map to place/adjust pin
        </div>
      </div>

      {/* Coordinates Display & Validation Bar */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Exact Latitude (°N)
            </label>
            <input
              type="text"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              onBlur={handleApplyManual}
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Exact Longitude (°E)
            </label>
            <input
              type="text"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              onBlur={handleApplyManual}
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800"
            />
          </div>
        </div>

        {/* Selected Coordinates Status */}
        <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-slate-700 font-bold">
              {selectedCoords.lat.toFixed(5)}, {selectedCoords.lng.toFixed(5)}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-800"
          >
            {isCopied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Save Action */}
        <div className="flex gap-2 pt-1">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            onClick={() =>
              onSaveLocation(selectedCoords, {
                address: addressSearch,
                city: selectedCity,
              })
            }
            className="flex-2 py-2.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save Clinic Coordinates</span>
          </button>
        </div>
      </div>
    </div>
  );
};
