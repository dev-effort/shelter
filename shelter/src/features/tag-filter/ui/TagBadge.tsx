import { IonBadge } from '@ionic/react';

interface TagBadgeProps {
  tag: string;
  count?: number;
  selected?: boolean;
  onClick?: (tag: string) => void;
  onRemove?: (tag: string) => void;
  showRemove?: boolean;
}

export default function TagBadge({
  tag,
  count,
  selected = false,
  onClick,
  onRemove,
  showRemove = false,
}: TagBadgeProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(tag);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(tag);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(tag);
    }
  };

  return (
    <IonBadge
      color={selected ? 'primary' : 'light'}
      onClick={onClick ? handleClick : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={`태그: ${tag}${count !== undefined ? `, ${count}개의 링크` : ''}${selected ? ', 선택됨' : ''}`}
      className={`inline-flex items-center gap-1 px-2 py-1 text-sm ${onClick ? 'cursor-pointer hover:opacity-80 active:opacity-60' : ''} ${selected ? 'font-medium' : ''} `}
      style={{
        transition: 'all 150ms ease',
      }}
    >
      <span>#{tag}</span>
      {count !== undefined && <span className="text-xs opacity-75">({count})</span>}
      {showRemove && onRemove && (
        <button
          onClick={handleRemove}
          className="ml-1 text-xs hover:text-red-500"
          style={{ lineHeight: 1 }}
          aria-label={`${tag} 태그 제거`}
        >
          ×
        </button>
      )}
    </IonBadge>
  );
}
