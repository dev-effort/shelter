import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon } from '@ionic/react';
import { linkOutline } from 'ionicons/icons';
import { Link } from '@/shared/types/entities';
import { TagBadge } from '@/features/tag-filter';

interface LinkCardProps {
  link: Link;
  onClick?: (link: Link) => void;
  onLongPress?: (link: Link) => void;
  onTagClick?: (tag: string) => void;
}

export default function LinkCard({ link, onClick, onLongPress, onTagClick }: LinkCardProps) {
  let longPressTimer: NodeJS.Timeout;

  const handleTouchStart = () => {
    longPressTimer = setTimeout(() => {
      onLongPress?.(link);
    }, 500);
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimer);
  };

  const handleClick = () => {
    onClick?.(link);
  };

  const handleTagClick = (tag: string) => {
    onTagClick?.(tag);
  };

  return (
    <IonCard
      className="m-0 mb-2 cursor-pointer transition-transform active:scale-[0.98]"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <IonCardHeader className="flex flex-row items-center justify-between pb-2">
        <IonCardTitle className="flex items-center gap-2 text-base font-medium">
          <IonIcon icon={linkOutline} className="h-5 w-5 text-muted-foreground" />
          {link.title}
        </IonCardTitle>
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
}
