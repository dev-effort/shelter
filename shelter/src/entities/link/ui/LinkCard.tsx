import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
} from '@ionic/react';
import { linkOutline } from 'ionicons/icons';
import { Link } from '@/shared/types/entities';

interface LinkCardProps {
  link: Link;
  onClick?: (link: Link) => void;
  onLongPress?: (link: Link) => void;
}

export default function LinkCard({ link, onClick, onLongPress }: LinkCardProps) {
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
            {link.tags.map((tag) => (
              <IonBadge key={tag} color="light" className="text-xs">
                #{tag}
              </IonBadge>
            ))}
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
}
