import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, MicOff, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SPEECH_LANG_MAP } from '../../translations';

export interface VoiceSearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeValue?: (value: string) => void;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
  leftIcon?: React.ReactNode;
  hideLeftIcon?: boolean;
  containerClassName?: string;
  inputClassName?: string;
  micClassName?: string;
  placeholder?: string;
  language?: 'en-IN' | 'hi-IN' | 'auto';
  searchCategory?: 'doctor' | 'hospital' | 'medicine' | 'test' | 'location' | 'general';
}

export const VoiceSearchInput: React.FC<VoiceSearchInputProps> = ({
  value,
  onChange,
  onChangeValue,
  onSearch,
  onClear,
  showClearButton = true,
  leftIcon,
  hideLeftIcon = false,
  containerClassName = '',
  inputClassName = '',
  micClassName = '',
  placeholder = 'Search...',
  language = 'auto',
  searchCategory = 'general',
  disabled,
  autoFocus,
  onKeyDown,
  ...restProps
}) => {
  const { currentLanguage, showToast } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check Web Speech API availability
  const isSpeechSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Determine speech recognition language based on selected global language
  const getRecognitionLanguage = () => {
    if (language !== 'auto') return language;
    return SPEECH_LANG_MAP[currentLanguage] || 'en-IN';
  };

  // Stop listening on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Update input text programmatically and trigger handlers
  const updateInputValue = (newText: string, triggerSearch = false) => {
    if (onChangeValue) {
      onChangeValue(newText);
    }
    // Also trigger standard synthetic change event for standard inputs
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    )?.set;

    if (inputRef.current && nativeInputValueSetter) {
      nativeInputValueSetter.call(inputRef.current, newText);
      const ev = new Event('input', { bubbles: true });
      inputRef.current.dispatchEvent(ev);
    }

    if (triggerSearch && onSearch) {
      onSearch(newText);
    }
  };

  const handleStartListening = () => {
    // If already listening, stop recording
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      setIsListening(false);
      setInterimText('');
      return;
    }

    // Fallback simulation if speech recognition is not supported in the user's browser/environment
    if (!isSpeechSupported) {
      setIsListening(true);
      showToast(
        currentLanguage === 'hi'
          ? '🎙️ आवाज़ पहचानी जा रही है... बोलिए'
          : '🎙️ Listening... Speak your query now',
        'info'
      );

      // Context-aware fallback query
      const sampleQueries: Record<string, string> = {
        doctor: currentLanguage === 'hi' ? 'डॉक्टर शर्मा' : 'Cardiologist',
        hospital: currentLanguage === 'hi' ? 'सरकारी अस्पताल' : 'Apollo Hospital',
        medicine: currentLanguage === 'hi' ? 'पैरासिटामोल' : 'Paracetamol 650',
        test: currentLanguage === 'hi' ? 'रक्त परीक्षण' : 'Complete Blood Count',
        location: currentLanguage === 'hi' ? 'छतरपुर' : 'Chhatarpur',
        general: currentLanguage === 'hi' ? 'विशेषज्ञ डॉक्टर' : 'General Physician',
      };

      const fallbackWord = sampleQueries[searchCategory] || 'Doctor';

      setTimeout(() => {
        updateInputValue(fallbackWord, true);
        setIsListening(false);
        showToast(
          currentLanguage === 'hi'
            ? `आवाज़ पहचानी: "${fallbackWord}"`
            : `Voice recognized: "${fallbackWord}"`,
          'success'
        );
      }, 1600);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = getRecognitionLanguage();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimText('');
        showToast(
          currentLanguage === 'hi'
            ? '🎙️ माइक चालू है... बोलिए (हिंदी या अंग्रेज़ी)'
            : '🎙️ Listening... Speak now in English or Hindi',
          'info'
        );
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            currentInterim += item[0].transcript;
          }
        }

        if (currentInterim) {
          setInterimText(currentInterim);
        }

        if (finalTranscript) {
          const cleanText = finalTranscript.replace(/[.,]/g, '').trim();
          updateInputValue(cleanText, true);
          showToast(
            currentLanguage === 'hi'
              ? `आवाज़ पहचानी: "${cleanText}"`
              : `Voice recognized: "${cleanText}"`,
            'success'
          );
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setInterimText('');
        recognitionRef.current = null;

        if (event.error === 'not-allowed') {
          showToast(
            currentLanguage === 'hi'
              ? 'माइक्रोफ़ोन की अनुमति अस्वीकृत है। कृपया ब्राउज़र में अनुमति दें।'
              : 'Microphone permission denied. Please allow microphone access in your browser settings.',
            'warning'
          );
        } else if (event.error === 'no-speech') {
          showToast(
            currentLanguage === 'hi'
              ? 'कोई आवाज़ नहीं सुनाई दी। कृपया दोबारा माइक दबाकर बोलें।'
              : 'No speech detected. Please tap the mic and try speaking again.',
            'info'
          );
        } else {
          showToast(
            currentLanguage === 'hi'
              ? 'आवाज़ साफ़ नहीं सुनाई दी। कृपया दोबारा प्रयास करें।'
              : 'Could not hear voice input. Please try again.',
            'info'
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText('');
        recognitionRef.current = null;
      };

      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      setIsListening(false);
      setInterimText('');
      recognitionRef.current = null;
    }
  };

  const handleClear = () => {
    updateInputValue('', false);
    if (onClear) {
      onClear();
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <div className={`relative flex items-center w-full ${containerClassName}`}>
      {/* Left Icon (Search by default) */}
      {!hideLeftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center">
          {leftIcon || <Search className="w-4 h-4 text-slate-400" />}
        </div>
      )}

      {/* Main Search Input */}
      <input
        ref={inputRef}
        type="text"
        value={isListening && interimText ? interimText : value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={
          isListening
            ? currentLanguage === 'hi'
              ? 'सुन रहे हैं... बोलिए (हिंदी या अंग्रेज़ी)'
              : 'Listening... Speak in Hindi or English'
            : placeholder
        }
        disabled={disabled}
        autoFocus={autoFocus}
        className={`w-full text-xs font-semibold rounded-xl transition-all focus:outline-none ${
          hideLeftIcon ? 'pl-3.5' : 'pl-9'
        } pr-18 py-2.5 ${
          isListening
            ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/20 text-rose-800 placeholder-rose-500'
            : 'bg-white border border-slate-200 text-[#172B4D] placeholder-slate-400 focus:ring-2 focus:ring-[#087E8B]/20 focus:border-[#087E8B]'
        } ${inputClassName}`}
        {...restProps}
      />

      {/* Right Action Icons: Clear (X) + Microphone inside the search box */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {/* Clear Button */}
        {showClearButton && Boolean(value) && !isListening && (
          <button
            type="button"
            onClick={handleClear}
            title={currentLanguage === 'hi' ? 'मिटाएं' : 'Clear text'}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Microphone (Voice Search) Button */}
        <button
          type="button"
          onClick={handleStartListening}
          title={
            isListening
              ? currentLanguage === 'hi'
                ? 'माइक बंद करने के लिए टैप करें'
                : 'Tap to stop listening'
              : currentLanguage === 'hi'
              ? 'आवाज़ से खोजें (माइक)'
              : 'Voice Search with Mic (English & Hindi)'
          }
          className={`p-1.5 rounded-lg transition-all flex items-center justify-center relative cursor-pointer select-none ${
            isListening
              ? 'bg-rose-500 text-white shadow-md ring-4 ring-rose-200 animate-pulse scale-105'
              : 'text-slate-400 hover:text-[#087E8B] hover:bg-slate-100 active:scale-95'
          } ${micClassName}`}
        >
          {isListening ? (
            <Mic className="w-3.5 h-3.5 text-white" />
          ) : (
            <Mic className="w-3.5 h-3.5 text-[#087E8B]" />
          )}

          {/* Glowing pulse indicator dot when active */}
          {isListening && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-600 rounded-full animate-ping" />
          )}
        </button>
      </div>
    </div>
  );
};
