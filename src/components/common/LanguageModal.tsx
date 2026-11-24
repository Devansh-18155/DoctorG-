import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../../translations';
import { LanguageCode } from '../../types';
import { Search, Check, X, Globe } from 'lucide-react';
import { VoiceSearchInput } from './VoiceSearchInput';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { currentLanguage, setCurrentLanguage, showToast, t } = useApp();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<LanguageCode>(currentLanguage);

  // Sync selected with currentLanguage when opening
  React.useEffect(() => {
    if (isOpen) {
      setSelected(currentLanguage);
    }
  }, [isOpen, currentLanguage]);

  if (!isOpen) return null;

  const filtered = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  const handleApply = () => {
    setCurrentLanguage(selected);
    const chosen = SUPPORTED_LANGUAGES.find((l) => l.code === selected);
    showToast(`✓ Language set to ${chosen?.name} (${chosen?.nativeName})`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#172B4D]">{t('chooseLanguage', 'Choose Language')}</h3>
              <p className="text-[11px] text-slate-500">{t('thirteenLanguages', '13 Official Indian Languages')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search with Reusable Voice Search */}
        <div className="mt-3 mb-2">
          <VoiceSearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onChangeValue={setSearch}
            onClear={() => setSearch('')}
            placeholder={t('searchLanguage', 'Search language / भाषा खोजें...')}
            searchCategory="general"
            inputClassName="bg-slate-50"
          />
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 space-y-1.5 my-2 pr-1">
          {filtered.map((lang) => {
            const isChecked = selected === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setSelected(lang.code)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left border transition-all ${
                  isChecked
                    ? 'border-[#087E8B] bg-teal-50/50 text-[#087E8B]'
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <p className="text-xs font-bold leading-none">{lang.nativeName}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{lang.name}</p>
                </div>
                {isChecked && (
                  <div className="w-5 h-5 rounded-full bg-[#087E8B] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={handleApply}
            className="w-full py-2.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl font-semibold text-xs shadow-md shadow-teal-700/20 transition-all"
          >
            {t('continue', 'Apply & Continue')}
          </button>
        </div>
      </div>
    </div>
  );
};
