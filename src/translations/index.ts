// Doctor G - Centralized Global Internationalization (i18n) System
import { LanguageOption, LanguageCode } from '../types';
import { en } from './en';
import { hi } from './hi';
import { bn } from './bn';
import { mr } from './mr';
import { ta } from './ta';
import { te } from './te';
import { kn } from './kn';
import { ml } from './ml';
import { gu } from './gu';
import { pa } from './pa';
import { or, as, ur } from './others';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en,
  hi,
  bn,
  mr,
  ta,
  te,
  kn,
  ml,
  gu,
  pa,
  or,
  as,
  ur,
};

// Speech Recognition BCP-47 locale mapping for each language
export const SPEECH_LANG_MAP: Record<LanguageCode, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  or: 'or-IN',
  as: 'as-IN',
  ur: 'ur-IN',
};

// Global Translation Helper
export function getTranslation(key: string, lang: LanguageCode = 'en', fallback?: string): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  if (dict && dict[key]) {
    return dict[key];
  }
  if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
    return TRANSLATIONS.en[key];
  }
  return fallback !== undefined ? fallback : key;
}

export const LANGUAGE_STORAGE_KEY = 'doctor_g_preferred_language';
