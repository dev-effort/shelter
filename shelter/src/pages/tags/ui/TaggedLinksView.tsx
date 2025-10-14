import { useHistory } from 'react-router-dom';
import { IonCard, IonCardContent, IonCardHeader, IonButton, IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { Link } from '@/shared/types/entities';
import { LinkList } from '@/widgets/link-list';
import { TagBadge } from '@/features/tag-filter';

interface TaggedLinksViewProps {
  selectedTags: string[];
  filteredLinks: Link[];
  onRemoveTag: (tag: string) => void;
  onClearAll: () => void;
}

export default function TaggedLinksView({
  selectedTags,
  filteredLinks,
  onRemoveTag,
  onClearAll,
}: TaggedLinksViewProps) {
  const history = useHistory();

  const handleLinkClick = (link: Link) => {
    history.push(`/link/${link.id}`);
  };

  if (selectedTags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* 선택된 태그 표시 */}
      <IonCard>
        <IonCardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="text-sm font-medium">선택된 태그</div>
          <IonButton size="small" fill="clear" onClick={onClearAll}>
            <IonIcon slot="icon-only" icon={closeOutline} />
          </IonButton>
        </IonCardHeader>
        <IonCardContent>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <TagBadge key={tag} tag={tag} selected showRemove onRemove={onRemoveTag} />
            ))}
          </div>
        </IonCardContent>
      </IonCard>

      {/* 필터링된 링크 */}
      <div>
        <div className="mb-2 flex items-center justify-between px-1">
          <h3 className="text-sm font-medium text-muted-foreground">
            링크 ({filteredLinks.length}개)
          </h3>
        </div>
        {filteredLinks.length > 0 ? (
          <LinkList links={filteredLinks} onLinkClick={handleLinkClick} />
        ) : (
          <IonCard>
            <IonCardContent>
              <div className="text-center text-sm text-muted-foreground">
                선택한 태그를 모두 포함하는 링크가 없습니다
              </div>
            </IonCardContent>
          </IonCard>
        )}
      </div>
    </div>
  );
}
