import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  X,
  Volume2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Globe,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SPEECH_LANG_MAP } from '../../translations';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (spokenText: string) => void;
}

const VOICE_LANGUAGES = [
  { code: 'en-IN', label: 'English (India)', native: 'English' },
  { code: 'hi-IN', label: 'Hindi', native: 'हिन्दी' },
  { code: 'bn-IN', label: 'Bengali', native: 'বাংলা' },
  { code: 'mr-IN', label: 'Marathi', native: 'मराठी' },
  { code: 'ta-IN', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te-IN', label: 'Telugu', native: 'తెలుగు' },
  { code: 'kn-IN', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml-IN', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'gu-IN', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa-IN', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or-IN', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as-IN', label: 'Assamese', native: 'অসমীয়া' },
  { code: 'ur-IN', label: 'Urdu', native: 'اردو' },
];

const SUGGESTED_VOICE_QUERIES = [
  { text: 'Cardiologist in Salt Lake', category: 'Doctor' },
  { text: 'Paracetamol 650', category: 'Medicine' },
  { text: 'Full Body Health Checkup', category: 'Lab Test' },
  { text: 'ICU Ambulance', category: 'Ambulance' },
  { text: 'Blood Group O Positive', category: 'Blood Bank' },
  { text: 'Online Video Consultation', category: 'Consultation' },
  { text: 'Ayurvedic Doctor', category: 'Traditional' },
  { text: 'Apollo Multispecialty Hospital', category: 'Hospital' },
];

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
}) => {
  const { currentLanguage, showToast } = useApp();

  // Pick default recognition language based on app language
  const getDefaultLangCode = () => {
    return SPEECH_LANG_MAP[currentLanguage] || 'en-IN';
  };

  const [selectedLang, setSelectedLang] = useState<string>(getDefaultLangCode());

  // Keep recognition language synced with global currentLanguage
  useEffect(() => {
    setSelectedLang(getDefaultLangCode());
  }, [currentLanguage, isOpen]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);

  // Check Web Speech API availability
  const isSpeechSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Initialize and start recognition when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopListening();
      setTranscript('');
      setErrorMessage(null);
      setIsSuccess(false);
      return;
    }

    startListening();

    return () => {
      stopListening();
    };
  }, [isOpen, selectedLang]);

  const startListening = () => {
    setErrorMessage(null);
    setTranscript('');
    setIsSuccess(false);

    if (!isSpeechSupported) {
      setErrorMessage(
        'Speech recognition is not supported in this browser. Please use the quick prompts below or type to search.'
      );
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultTranscript = event.results[current][0].transcript;
        setTranscript(resultTranscript);

        if (event.results[current].isFinal) {
          handleSuccess(resultTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage(
            'Microphone access was denied. Please allow microphone permissions in your browser or select a query below.'
          );
        } else if (event.error === 'no-speech') {
          setErrorMessage('No speech detected. Please try speaking again.');
        } else {
          setErrorMessage(`Speech recognition error (${event.error}). You can tap any sample query below.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setErrorMessage('Could not initialize microphone. Please select a query below.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore already stopped error
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleSuccess = (finalQuery: string) => {
    const cleanQuery = finalQuery.trim();
    if (!cleanQuery) return;

    setIsSuccess(true);
    setIsListening(false);
    stopListening();

    setTimeout(() => {
      onSearch(cleanQuery);
      onClose();
    }, 600);
  };

  const handleSampleClick = (queryText: string) => {
    setTranscript(queryText);
    handleSuccess(queryText);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center text-[#087E8B]">
              <Mic className="w-4 h-4 text-[#087E8B]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#172B4D]">Doctor G Voice Search</h3>
              <p className="text-[10px] text-slate-500">Search everything across the app</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopListening();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col items-center text-center space-y-4 overflow-y-auto">
          {/* Animated Microphone Visualizer */}
          <div className="relative my-2">
            {/* Outer animated ripple rings when listening */}
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-teal-400/20 animate-ping scale-150"></div>
                <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-pulse scale-125"></div>
              </>
            )}

            <button
              onClick={() => {
                if (isListening) {
                  stopListening();
                } else {
                  startListening();
                }
              }}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all relative z-10 ${
                isSuccess
                  ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                  : isListening
                  ? 'bg-gradient-to-tr from-[#087E8B] to-teal-400 text-white shadow-teal-500/40 scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-9 h-9 animate-scale-up" />
              ) : isListening ? (
                <Mic className="w-9 h-9 animate-bounce" />
              ) : (
                <MicOff className="w-9 h-9 text-slate-400" />
              )}
            </button>
          </div>

          {/* Sound Waves Animation */}
          {isListening && (
            <div className="flex items-center justify-center gap-1.5 h-6">
              <span className="w-1 bg-[#087E8B] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3"></span>
              <span className="w-1 bg-[#087E8B] rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.1s] h-5"></span>
              <span className="w-1 bg-[#087E8B] rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.2s] h-4"></span>
              <span className="w-1 bg-[#087E8B] rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.3s] h-6"></span>
              <span className="w-1 bg-[#087E8B] rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.4s] h-4"></span>
              <span className="w-1 bg-[#087E8B] rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.2s] h-5"></span>
              <span className="w-1 bg-[#087E8B] rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.1s] h-3"></span>
            </div>
          )}

          {/* Status Message & Live Transcript */}
          <div className="w-full">
            {isSuccess ? (
              <div className="bg-emerald-50 text-emerald-800 rounded-2xl p-3 border border-emerald-200 animate-in fade-in">
                <p className="text-xs font-bold flex items-center justify-center gap-1">
                  <span>Searching for:</span>
                  <span className="underline">"{transcript}"</span>
                </p>
              </div>
            ) : isListening ? (
              <div className="space-y-1">
                <p className="text-xs font-bold text-teal-700 animate-pulse">
                  Listening... Speak now
                </p>
                <div className="min-h-10 bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
                  {transcript ? (
                    <p className="text-sm font-semibold text-[#172B4D]">"{transcript}"</p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      "Doctor, Hospital, Medicine, Test, Ambulance..."
                    </p>
                  )}
                </div>
              </div>
            ) : errorMessage ? (
              <div className="bg-amber-50 text-amber-800 rounded-2xl p-3 border border-amber-200 text-left space-y-1">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">{errorMessage}</p>
                </div>
                <button
                  onClick={startListening}
                  className="mt-2 w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Tap to Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">Tap the mic to start speaking</p>
                <button
                  onClick={startListening}
                  className="px-4 py-2 bg-[#087E8B] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#06626D] transition-colors"
                >
                  Start Speaking
                </button>
              </div>
            )}
          </div>

          {/* Language Selector Pill */}
          <div className="w-full pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
              <span className="flex items-center gap-1 font-semibold text-slate-600">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Voice Language:</span>
              </span>
              <span className="font-bold text-[#087E8B]">
                {VOICE_LANGUAGES.find((l) => l.code === selectedLang)?.native}
              </span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {VOICE_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLang(lang.code);
                    if (isListening) {
                      stopListening();
                    }
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${
                    selectedLang === lang.code
                      ? 'bg-[#087E8B] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lang.native}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Voice Search Prompts */}
          <div className="w-full text-left pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Or tap to voice search instantly:</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-0.5">
              {SUGGESTED_VOICE_QUERIES.map((item) => (
                <button
                  key={item.text}
                  onClick={() => handleSampleClick(item.text)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-teal-50/70 border border-slate-200/80 hover:border-teal-300 text-left transition-all group flex flex-col justify-between"
                >
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-teal-600">
                    {item.category}
                  </span>
                  <span className="text-[11px] font-medium text-slate-700 group-hover:text-[#087E8B] truncate w-full">
                    "{item.text}"
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            Searches Doctors, Hospitals, Medicines, Tests, Ambulance & Blood Banks
          </p>
        </div>
      </div>
    </div>
  );
};
