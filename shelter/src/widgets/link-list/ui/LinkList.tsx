import { useState } from 'react';
import { IonButton } from '@ionic/react';
import { LinkCard } from '@/entities/link';
import { Link } from '@/shared/types/entities';
import { useSettingsStore } from '@/app/providers/stores';

interface LinkListProps {
  links: Link[];
  onLinkClick?: (link: Link) => void;
  onLinkLongPress?: (link: Link) => void;
  emptyMessage?: string;
}

const INITIAL_DISPLAY_COUNT = 100;
const LOAD_MORE_COUNT = 50;

export default function LinkList({
  links,
  onLinkClick,
  onLinkLongPress,
  emptyMessage = '링크가 없습니다',
}: LinkListProps) {
  const { settings } = useSettingsStore();
  const viewMode = settings?.viewMode || 'list';
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);

  if (links.length === 0) {
    return <div className="py-8 text-center text-sm text-muted-foreground">{emptyMessage}</div>;
  }

  const displayedLinks = links.slice(0, displayCount);
  const hasMore = displayCount < links.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + LOAD_MORE_COUNT, links.length));
  };

  // Grid 뷰
  if (viewMode === 'grid') {
    return (
      <>
        <div className="grid grid-cols-2 gap-2">
          {displayedLinks.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onClick={onLinkClick}
              onLongPress={onLinkLongPress}
            />
          ))}
        </div>
        {hasMore && (
          <div className="mt-4 flex justify-center">
            <IonButton fill="outline" onClick={handleLoadMore}>
              {links.length - displayCount}개 더 보기
            </IonButton>
          </div>
        )}
      </>
    );
  }

  // List 뷰 (기본)
  return (
    <>
      <div className="space-y-2">
        {displayedLinks.map((link) => (
          <LinkCard key={link.id} link={link} onClick={onLinkClick} onLongPress={onLinkLongPress} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-4 flex justify-center">
          <IonButton fill="outline" onClick={handleLoadMore}>
            {links.length - displayCount}개 더 보기
          </IonButton>
        </div>
      )}
    </>
  );
}
