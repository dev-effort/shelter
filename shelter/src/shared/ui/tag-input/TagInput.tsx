import { useState } from 'react';
import { IonChip, IonIcon, IonInput } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';

interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  placeholder?: string;
}

export default function TagInput({
  tags,
  onAddTag,
  onRemoveTag,
  placeholder = '태그 입력 후 Enter',
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      onAddTag(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="space-y-2">
      <IonInput
        value={inputValue}
        onIonInput={(e) => setInputValue(e.detail.value || '')}
        onKeyDown={handleKeyDown as any}
        placeholder={placeholder}
        clearInput
      />

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <IonChip key={tag} className="m-0">
              <span>#{tag}</span>
              <IonIcon
                icon={closeOutline}
                onClick={() => onRemoveTag(tag)}
                className="cursor-pointer"
              />
            </IonChip>
          ))}
        </div>
      )}
    </div>
  );
}
