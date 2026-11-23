import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  Users,
  Plus,
  User,
  Heart,
  Calendar,
  FileText,
  Clock,
  ShieldCheck,
  X,
  Check,
} from 'lucide-react';
import { FamilyMember } from '../../types';

export const FamilyHealthScreen: React.FC = () => {
  const {
    goBack,
    navigateTo,
    familyMembers,
    activeFamilyMemberId,
    setActiveFamilyMemberId,
    addFamilyMember,
    showToast,
  } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<any>('Spouse');
  const [age, setAge] = useState(40);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female');
  const [bloodGroup, setBloodGroup] = useState('O+');

  const activeMember =
    familyMembers.find((m) => m.id === activeFamilyMemberId) || familyMembers[0];

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter family member name', 'warning');
      return;
    }
    addFamilyMember({
      name,
      relationship,
      age,
      gender,
      bloodGroup,
    });
    setIsAddOpen(false);
    setName('');
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

        <span className="text-xs font-bold text-[#172B4D]">Family Health Management</span>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1 bg-[#087E8B] hover:bg-[#06626D] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Member</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Active Member Banner */}
        <div className="bg-gradient-to-r from-purple-800 to-[#172B4D] rounded-3xl p-5 text-white shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
            Currently Viewing Profile
          </span>
          <h3 className="font-extrabold text-base text-white mt-1">{activeMember.name}</h3>
          <p className="text-xs text-purple-200 mt-0.5">
            Relationship: <strong>{activeMember.relationship}</strong> • Age: {activeMember.age}y • Blood Group: {activeMember.bloodGroup}
          </p>

          <div className="flex gap-2 mt-4 pt-3 border-t border-white/20">
            <button
              onClick={() => navigateTo('book-appointment')}
              className="flex-1 py-2 bg-white text-purple-900 rounded-xl text-xs font-bold shadow-xs hover:bg-purple-50"
            >
              Book for {activeMember.name.split(' ')[0]}
            </button>
            <button
              onClick={() => navigateTo('health-records')}
              className="flex-1 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-bold"
            >
              View Records
            </button>
          </div>
        </div>

        {/* Family Members Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Linked Family Members ({familyMembers.length})
          </h4>

          {familyMembers.map((member) => {
            const isCurrent = member.id === activeFamilyMemberId;
            return (
              <div
                key={member.id}
                onClick={() => {
                  setActiveFamilyMemberId(member.id);
                  showToast(`Switched active profile to ${member.name}`, 'info');
                }}
                className={`p-4 rounded-2xl border bg-white cursor-pointer transition-all flex items-center justify-between ${
                  isCurrent
                    ? 'border-purple-600 ring-2 ring-purple-600/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base ${
                      isCurrent
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {member.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-[#172B4D]">{member.name}</h4>
                      {isCurrent && (
                        <span className="text-[9px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {member.relationship} • {member.age} yrs • Blood {member.bloodGroup}
                    </p>
                    {member.allergies && member.allergies.length > 0 && (
                      <p className="text-[10px] text-rose-600 font-medium mt-0.5">
                        Allergies: {member.allergies.join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-purple-700">
                    {isCurrent ? 'Viewing ✓' : 'Switch'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Member Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#172B4D]">Add Family Member</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maitreyi Gupta"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Relationship
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl cursor-pointer font-bold"
                  >
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="O+">O+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                  </select>
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
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
