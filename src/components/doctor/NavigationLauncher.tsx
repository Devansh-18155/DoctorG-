import React from 'react';
import {
  ExternalLink,
  Navigation,
  Compass,
  ArrowRight,
  Map,
  Share2,
} from 'lucide-react';
import { buildGoogleMapsUrl } from '../../utils/doctorDiscoveryHelper';

interface NavigationLauncherProps {
  destination: { lat: number; lng: number; name?: string; address?: string };
  origin?: { lat: number; lng: number } | null;
  mode?: 'driving' | 'walking';
  onReturnToApp?: () => void;
}

export const NavigationLauncher: React.FC<NavigationLauncherProps> = ({
  destination,
  origin,
  mode = 'driving',
  onReturnToApp,
}) => {
  const { appUrl, webUrl } = buildGoogleMapsUrl(destination, origin, mode);

  const handleLaunchGoogleMaps = () => {
    // Open in new tab or trigger native Google Maps app intent
    window.open(webUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareDirections = () => {
    if (navigator.share) {
      navigator.share({
        title: `Directions to ${destination.name || 'Doctor Clinic'}`,
        text: `Navigate to ${destination.name || 'Clinic'} at ${destination.address || ''}`,
        url: webUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(webUrl);
      alert('Navigation link copied to clipboard!');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#087E8B]">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-[#172B4D]">
              External Live GPS Navigation
            </h4>
            <p className="text-[10px] text-slate-500">
              Open turn-by-turn spoken guidance in Google Maps or Browser
            </p>
          </div>
        </div>

        <button
          onClick={handleShareDirections}
          title="Share Directions"
          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {/* Main Google Maps Button */}
        <button
          onClick={handleLaunchGoogleMaps}
          className="w-full py-3.5 px-4 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 group"
        >
          <Compass className="w-4 h-4 text-teal-200 group-hover:rotate-45 transition-transform" />
          <span>Start Navigation (Google Maps)</span>
          <ExternalLink className="w-3.5 h-3.5 text-teal-200" />
        </button>

        {/* Fallback / Return Button */}
        {onReturnToApp && (
          <button
            onClick={onReturnToApp}
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition-colors text-center"
          >
            Return to Doctor G
          </button>
        )}
      </div>

      <p className="text-[10px] text-slate-400 text-center">
        Destination Coordinates: {destination.lat.toFixed(5)}, {destination.lng.toFixed(5)} •
        Compatible with Google Maps, Apple Maps & In-car Bluetooth
      </p>
    </div>
  );
};
