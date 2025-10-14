import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon } from '@ionic/react';
import { linkOutline } from 'ionicons/icons';
import { Link } from '@/shared/types/entities';
import Highlight from '@/shared/ui/highlight/Highlight';
import { TagBadge } from '@/features/tag-filter';

interface SearchResultsProps {
  results: Link[];
  query: string;
  onLinkClick: (link: Link) => void;
  onTagClick?: (tag: string) => void;
}

export default function SearchResults({
  results,
  query,
  onLinkClick,
  onTagClick,
}: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <IonCard>
        <IonCardContent>
          <div className="py-8 text-center text-sm text-muted-foreground">
            검색 결과가 없습니다
            <br />
            다른 키워드로 검색해보세요
          </div>
        </IonCardContent>
      </IonCard>
    );
  }

  return (
    <div className="space-y-2">
      {results.map((link) => (
        <IonCard
          key={link.id}
          className="m-0 cursor-pointer transition-transform active:scale-[0.98]"
          onClick={() => onLinkClick(link)}
        >
          <IonCardHeader className="flex flex-row items-center justify-between pb-2">
            <IonCardTitle className="flex items-center gap-2 text-base font-medium">
              <IonIcon icon={linkOutline} className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
              <Highlight text={link.title} query={query} />
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <p className="truncate text-sm text-muted-foreground">
              <Highlight text={link.url} query={query} />
            </p>

            {link.description && (
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                <Highlight text={link.description} query={query} />
              </p>
            )}

            {link.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
                {link.tags.slice(0, 3).map((tag) => (
                  <TagBadge key={tag} tag={tag} onClick={() => onTagClick?.(tag)} />
                ))}
                {link.tags.length > 3 && (
                  <span className="text-xs text-muted-foreground">+{link.tags.length - 3}</span>
                )}
              </div>
            )}
          </IonCardContent>
        </IonCard>
      ))}
    </div>
  );
}
