import React from 'react';
import { VoiceSearchInput } from '../common/VoiceSearchInput';

interface DoctorSearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onOpenVoiceSearch?: () => void;
  resultCount?: number;
  placeholder?: string;
}

export const DoctorSearchBar: React.FC<DoctorSearchBarProps> = ({
  value,
  onChange,
  resultCount,
  placeholder = 'Search doctor, specialization, clinic or hospital...',
}) => {
  return (
    <VoiceSearchInput
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onChangeValue={onChange}
      onClear={() => onChange('')}
      placeholder={placeholder}
      searchCategory="doctor"
      inputClassName="rounded-2xl shadow-2xs"
    />
  );
};
