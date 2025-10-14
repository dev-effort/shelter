import { IonSearchbar } from '@ionic/react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = '제목, URL, 설명 검색...',
  disabled = false,
}: SearchBarProps) {
  const handleIonChange = (e: CustomEvent) => {
    onChange(e.detail.value || '');
  };

  const handleIonClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <IonSearchbar
      value={value}
      onIonInput={handleIonChange}
      onIonClear={handleIonClear}
      placeholder={placeholder}
      disabled={disabled}
      debounce={0} // We handle debouncing in the hook
      showClearButton="focus"
      animated
      className="pb-0"
    />
  );
}
