import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Paperclip,
  Send,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Calendar,
  ShieldCheck,
  User,
} from 'lucide-react';
import { DOCTORS } from '../../data/mockData';
import { Doctor } from '../../types';

export const OnlineConsultationScreen: React.FC = () => {
  const {
    goBack,
    navigateTo,
    activeConsultation,
    startConsultation,
    endConsultation,
    sendConsultationMessage,
    showToast,
  } = useApp();

  const [viewState, setViewState] = useState<'home' | 'call' | 'chat' | 'completed'>('home');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(DOCTORS[0]);
  const [consultType, setConsultType] = useState<'video' | 'chat'>('video');

  // Video call control states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(14);
  const [chatInput, setChatInput] = useState('');

  // Call timer simulation
  useEffect(() => {
    let interval: any = null;
    if (viewState === 'call') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [viewState]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  const handleStartSession = () => {
    startConsultation({
      id: `cons-${Date.now()}`,
      consultationType: consultType,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      doctorImage: selectedDoctor.imageUrl,
      patientName: 'Subhasis Gupta',
      status: 'IN_CALL',
      durationSeconds: 0,
      messages: [
        {
          id: '1',
          sender: 'doctor',
          text: `Namaste Subhasis ji! I am ${selectedDoctor.name}. How are you feeling today? Please describe your symptoms.`,
          timestamp: '10:30 AM',
        },
      ],
    });

    if (consultType === 'video') {
      setViewState('call');
    } else {
      setViewState('chat');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendConsultationMessage(chatInput);
    setChatInput('');
  };

  const handleEndCall = () => {
    endConsultation();
    setViewState('completed');
  };

  return (
    <div className="min-h-full pb-20 bg-[#F6F8FA]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-20 flex items-center justify-between shadow-2xs">
        <button
          onClick={() => {
            if (viewState !== 'home') setViewState('home');
            else goBack();
          }}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{viewState === 'home' ? 'Home' : 'Back'}</span>
        </button>

        <span className="text-xs font-bold text-[#172B4D]">
          {viewState === 'call'
            ? 'Live Video Consultation'
            : viewState === 'chat'
            ? 'Live Doctor Chat'
            : viewState === 'completed'
            ? 'Consultation Summary'
            : 'Online Doctor Consultation'}
        </span>

        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
          HD Encrypted
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* ========================================================
            HOME: SELECT SPECIALTY & DOCTOR
            ======================================================== */}
        {viewState === 'home' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Banner */}
            <div className="bg-gradient-to-r from-violet-900 to-[#172B4D] p-4 rounded-3xl text-white shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300">
                Instant Telemedicine
              </span>
              <h3 className="font-extrabold text-sm text-white mt-0.5">
                Consult Top Specialists from the Comfort of Home
              </h3>
              <p className="text-[11px] text-violet-200 mt-0.5">
                Verified digital prescriptions valid at all Indian medical stores
              </p>
            </div>

            {/* Mode selection */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Consultation Medium
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setConsultType('video')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    consultType === 'video'
                      ? 'border-[#087E8B] bg-teal-50/50 text-[#087E8B] font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <Video className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs block">Video Consultation</span>
                  <span className="text-[10px] text-slate-400 font-normal">HD Face-to-Face</span>
                </button>
                <button
                  onClick={() => setConsultType('chat')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    consultType === 'chat'
                      ? 'border-[#087E8B] bg-teal-50/50 text-[#087E8B] font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <MessageSquare className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs block">Live Doctor Chat</span>
                  <span className="text-[10px] text-slate-400 font-normal">Instant Messaging</span>
                </button>
              </div>
            </div>

            {/* Available Doctors List */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Doctors Available Right Now
              </h4>
              <div className="space-y-3">
                {DOCTORS.slice(0, 3).map((doc) => {
                  const isSelected = selectedDoctor.id === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoctor(doc)}
                      className={`bg-white p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#087E8B] ring-1 ring-teal-500 shadow-md'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <img
                            src={doc.imageUrl}
                            alt={doc.name}
                            className="w-14 h-14 rounded-xl object-cover"
                          />
                          <span className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white absolute -bottom-0.5 -right-0.5"></span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-[#172B4D] truncate">{doc.name}</h4>
                          <p className="text-[11px] text-teal-700 font-semibold truncate">
                            {doc.specialty}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {doc.qualification}
                          </p>
                          <p className="text-[10px] text-emerald-600 font-bold mt-1">
                            ● Available Now for Instant Connect
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-[#172B4D]">
                            ₹{doc.consultationFee}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleStartSession}
              className="w-full py-3.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
            >
              {consultType === 'video' ? (
                <Video className="w-4 h-4" />
              ) : (
                <MessageSquare className="w-4 h-4" />
              )}
              <span>
                Start Instant {consultType === 'video' ? 'Video Call' : 'Chat'} (₹{selectedDoctor.consultationFee})
              </span>
            </button>
          </div>
        )}

        {/* ========================================================
            LIVE VIDEO CALL SCREEN
            ======================================================== */}
        {viewState === 'call' && (
          <div className="space-y-4 animate-in zoom-in-95">
            {/* Main Video Viewport */}
            <div className="h-80 bg-slate-900 rounded-3xl overflow-hidden relative border border-slate-700 shadow-xl flex items-center justify-center">
              {/* Doctor Video Feed */}
              {!isVideoOff ? (
                <img
                  src={selectedDoctor.imageUrl}
                  alt={selectedDoctor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-white">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-2 text-teal-400 font-bold text-xl">
                    Dr
                  </div>
                  <p className="text-xs font-bold">{selectedDoctor.name}</p>
                </div>
              )}

              {/* Patient Picture-in-Picture */}
              <div className="absolute top-3 right-3 w-24 h-32 rounded-xl bg-slate-800 border-2 border-white shadow-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                  alt="You"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] font-bold px-1 rounded">
                  You
                </span>
              </div>

              {/* Call Timer Overlay */}
              <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-mono font-bold flex items-center gap-1.5 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>{formatTimer(callDuration)}</span>
              </div>

              {/* Bottom Call Action Bar */}
              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3">
                {/* Mute toggle */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md transition-all ${
                    isMuted ? 'bg-rose-600' : 'bg-slate-800/80 hover:bg-slate-700'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Video toggle */}
                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md transition-all ${
                    isVideoOff ? 'bg-rose-600' : 'bg-slate-800/80 hover:bg-slate-700'
                  }`}
                  title={isVideoOff ? 'Start Camera' : 'Stop Camera'}
                >
                  {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>

                {/* Switch to Chat */}
                <button
                  onClick={() => setViewState('chat')}
                  className="w-11 h-11 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-white shadow-md"
                  title="Open Chat"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>

                {/* End Call Button */}
                <button
                  onClick={handleEndCall}
                  className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-700 flex items-center justify-center text-white shadow-lg animate-pulse"
                  title="End Consultation"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-500 text-center">
              Connected with <strong className="text-slate-800">{selectedDoctor.name}</strong> • 1080p Encrypted Stream
            </div>
          </div>
        )}

        {/* ========================================================
            LIVE CHAT SCREEN
            ======================================================== */}
        {viewState === 'chat' && (
          <div className="space-y-3 animate-in fade-in">
            {/* Messages Scroll Area */}
            <div className="bg-white rounded-3xl border border-slate-200 p-4 h-80 overflow-y-auto space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                {activeConsultation?.messages.map((msg) => {
                  const isMe = msg.sender === 'patient';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-[#087E8B] text-white rounded-br-none shadow-xs'
                            : 'bg-slate-100 text-slate-800 rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-0.5 px-1 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* End consultation button */}
              <button
                onClick={handleEndCall}
                className="w-full py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold hover:bg-rose-100"
              >
                End Consultation & Generate Prescription
              </button>
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your symptoms or message..."
                className="flex-1 px-4 py-2.5 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* ========================================================
            CONSULTATION COMPLETED & PRESCRIPTION
            ======================================================== */}
        {viewState === 'completed' && (
          <div className="space-y-4 animate-in zoom-in-95 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-xl font-extrabold text-[#172B4D]">Consultation Completed</h2>
            <p className="text-xs text-slate-500">
              Dr. {selectedDoctor.name} has concluded the teleconsultation.
            </p>

            {/* Doctor Advice & Digital Prescription Card */}
            <div className="bg-white rounded-3xl border border-teal-200 p-5 text-left space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest">
                  Official Digital Rx
                </span>
                <span className="text-[10px] text-slate-400 font-mono">RX-2026-9021</span>
              </div>

              <div>
                <h5 className="font-bold text-xs text-[#172B4D]">Doctor Clinical Instructions:</h5>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                  "Take Paracetamol 650mg TDS for 3 days if temperature spikes. Maintain oral rehydration with adequate electrolytes. Avoid spicy or fried food for 48 hours."
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Digital Prescription PDF</span>
                <button
                  onClick={() => showToast('Prescription PDF downloaded to device', 'success')}
                  className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Rx</span>
                </button>
              </div>
            </div>

            {/* Order Medicines with this Rx */}
            <button
              onClick={() => navigateTo('medical-store')}
              className="w-full py-3 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-700/20"
            >
              Order Prescribed Medicines for Doorstep Delivery
            </button>

            <button
              onClick={() => navigateTo('home')}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Return to Home Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
