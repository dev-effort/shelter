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
  placeholder = '태그 입력 후 Enter, 쉼표, 마침표',
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      onAddTag(inputValue.trim());
      setInputValue('');
    }
  };

  const handleInput = (e: CustomEvent) => {
    const value = e.detail.value || '';

    // 쉼표나 마침표가 입력되면 태그 추가
    if (value.includes(',') || value.includes('.')) {
      // 쉼표와 마침표를 모두 구분자로 사용
      const parts = value.split(/[,.]/).filter((part) => part !== '');

      // 마지막 부분을 제외하고 모두 태그로 추가
      const shouldAddTags = value.endsWith(',') || value.endsWith('.');
      const tagsToAdd = shouldAddTags ? parts : parts.slice(0, -1);

      tagsToAdd.forEach((tag) => {
        const trimmedTag = tag.trim();
        if (trimmedTag) {
          onAddTag(trimmedTag);
        }
      });

      // 구분자로 끝나면 입력 필드 비우고, 아니면 마지막 부분 남김
      if (shouldAddTags) {
        setInputValue('');
      } else {
        setInputValue(parts[parts.length - 1]);
      }
    } else {
      setInputValue(value);
    }
  };

  return (
    <div className="space-y-2">
      <IonInput
        value={inputValue}
        onIonInput={handleInput}
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
