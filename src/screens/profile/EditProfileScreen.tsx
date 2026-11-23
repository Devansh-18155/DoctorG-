import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, User, Phone, Mail, Calendar, Camera } from 'lucide-react';

export const EditProfileScreen: React.FC = () => {
  const { user, updateUserProfile, goBack, showToast } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [dob, setDob] = useState(user?.dob || '1978-05-14');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(user?.gender || 'male');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || 'B+');
  const [address, setAddress] = useState(user?.address || 'Salt Lake Sector 1, Kolkata');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      email,
      dob,
      gender,
      bloodGroup,
      address,
    });
    goBack();
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

        <span className="text-xs font-bold text-[#172B4D]">Edit Personal Info</span>

        <span className="w-8"></span>
      </div>

      <div className="p-4 space-y-4">
        {/* Photo change avatar */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-teal-500 shadow-md">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => showToast('Profile picture update enabled', 'info')}
              className="absolute bottom-0 right-0 w-7 h-7 bg-[#087E8B] rounded-full text-white flex items-center justify-center shadow-xs"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-xs text-slate-500 mt-2 font-medium">Change Profile Picture</span>
        </div>

        <form onSubmit={handleSave} className="bg-white p-4 rounded-3xl border border-slate-200 space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Mobile Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
            >
              <option value="A+">A+</option>
              <option value="B+">B+</option>
              <option value="O+">O+</option>
              <option value="AB+">AB+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Residential Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all mt-2"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};
