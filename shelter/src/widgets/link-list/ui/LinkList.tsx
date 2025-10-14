import { LinkCard } from '@/entities/link';
import { Link } from '@/shared/types/entities';
import { useSettingsStore } from '@/app/providers/stores';

interface LinkListProps {
  links: Link[];
  onLinkClick?: (link: Link) => void;
  onLinkLongPress?: (link: Link) => void;
  emptyMessage?: string;
}

export default function LinkList({
  links,
  onLinkClick,
  onLinkLongPress,
  emptyMessage = '링크가 없습니다',
}: LinkListProps) {
  const { settings } = useSettingsStore();
  const viewMode = settings?.viewMode || 'list';

  if (links.length === 0) {
    return <div className="py-8 text-center text-sm text-muted-foreground">{emptyMessage}</div>;
  }

  // Grid 뷰
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-2">
        {links.map((link) => (
          <LinkCard key={link.id} link={link} onClick={onLinkClick} onLongPress={onLinkLongPress} />
        ))}
      </div>
    );
  }

  // List 뷰 (기본)
  return (
    <div className="space-y-2">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} onClick={onLinkClick} onLongPress={onLinkLongPress} />
      ))}
    </div>
  );
}
