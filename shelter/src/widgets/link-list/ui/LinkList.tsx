import { LinkCard } from '@/entities/link';
import { Link } from '@/shared/types/entities';

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
  if (links.length === 0) {
    return <div className="py-8 text-center text-sm text-muted-foreground">{emptyMessage}</div>;
  }

  return (
    <div className="space-y-2">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} onClick={onLinkClick} onLongPress={onLinkLongPress} />
      ))}
    </div>
  );
}
