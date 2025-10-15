import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon } from '@ionic/react';
import { linkOutline, openOutline } from 'ionicons/icons';
import { Link } from '@/shared/types/entities';
import { TagBadge } from '@/features/tag-filter';

interface LinkCardProps {
  link: Link;
  onClick?: (link: Link) => void;
  onLongPress?: (link: Link) => void;
  onTagClick?: (tag: string) => void;
}

const LinkCard = React.memo(function LinkCard({
  link,
  onClick,
  onLongPress,
  onTagClick,
}: LinkCardProps) {
  const longPressTimerRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const touchStartPos = React.useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };

    longPressTimerRef.current = setTimeout(() => {
      onLongPress?.(link);
    }, 500);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);

    // 10px 이상 이동하면 스와이프로 간주하고 long press 취소
    if (deltaX > 10 || deltaY > 10) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = undefined;
      }
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = undefined;
    }
    touchStartPos.current = null;
  };

  const handleClick = () => {
    onClick?.(link);
  };

  const handleTagClick = (tag: string) => {
    onTagClick?.(tag);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(link);
    }
  };

  // Extract domain for favicon
  const getFaviconUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
    } catch {
      return null;
    }
  };

  const faviconUrl = getFaviconUrl(link.url);
  const [faviconError, setFaviconError] = React.useState(false);

  return (
    <IonCard
      className="m-0 mb-2 cursor-pointer transition-transform active:scale-[0.98]"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`링크: ${link.title}, URL: ${link.url}`}
    >
      <IonCardHeader className="flex flex-row items-center justify-between pb-2">
        <IonCardTitle className="flex flex-1 items-center gap-2 text-base font-medium">
          {faviconUrl && !faviconError ? (
            <img
              src={faviconUrl}
              alt=""
              loading="lazy"
              onError={() => setFaviconError(true)}
              className="h-5 w-5 rounded"
            />
          ) : (
            <IonIcon icon={linkOutline} className="h-5 w-5 text-muted-foreground" />
          )}
          {link.title}
        </IonCardTitle>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center rounded-md border-primary p-2 text-primary transition-colors"
          aria-label={`${link.title} 링크 열기`}
        >
          <IonIcon icon={openOutline} className="h-5 w-5" aria-hidden="true" />
        </a>
      </IonCardHeader>

      <IonCardContent>
        <p className="truncate text-sm text-muted-foreground">{link.url}</p>

        {link.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{link.description}</p>
        )}

        {link.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {link.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} onClick={onTagClick} />
            ))}
            {link.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">+{link.tags.length - 3}</span>
            )}
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
});

export default LinkCard;
