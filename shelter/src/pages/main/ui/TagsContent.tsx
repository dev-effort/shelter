import { useEffect } from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonSpinner,
} from '@ionic/react';
import { AdBanner } from '@/widgets/ad-banner';
import { useTagStore } from '@/app/providers/stores';
import { useTagFilter, TagBadge } from '@/features/tag-filter';
import TaggedLinksView from '@/pages/tags/ui/TaggedLinksView';

interface TagsContentProps {
  history: any;
}

const TagsContent: React.FC<TagsContentProps> = ({ history }) => {
  const { tags, isLoading, loadTags } = useTagStore();
  const { selectedTags, filteredLinks, toggleTag, removeTag, clearTags } = useTagFilter();

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  // 태그를 개수 순으로 정렬
  const sortedTags = [...tags].sort((a, b) => b.count - a.count);

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>태그</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* 헤더 아래 배너 광고 */}
      <AdBanner />

      <IonContent>
        <div className="space-y-4 p-4 pb-32">
          {/* 로딩 상태 */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <IonSpinner />
            </div>
          )}

          {/* 태그가 없는 경우 */}
          {!isLoading && tags.length === 0 && (
            <IonCard>
              <IonCardContent>
                <div className="text-center text-sm text-muted-foreground">
                  아직 태그가 없습니다
                  <br />
                  링크에 태그를 추가해보세요
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {/* 모든 태그 목록 */}
          {!isLoading && tags.length > 0 && (
            <IonCard>
              <IonCardHeader>
                <div className="text-sm font-medium">모든 태그 ({tags.length}개)</div>
              </IonCardHeader>
              <IonCardContent>
                <div className="flex flex-wrap gap-2">
                  {sortedTags.map((tag) => (
                    <TagBadge
                      key={tag.name}
                      tag={tag.name}
                      count={tag.count}
                      selected={selectedTags.includes(tag.name)}
                      onClick={toggleTag}
                    />
                  ))}
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {/* 필터링된 링크 표시 */}
          <TaggedLinksView
            selectedTags={selectedTags}
            filteredLinks={filteredLinks}
            onRemoveTag={removeTag}
            onClearAll={clearTags}
          />
        </div>
      </IonContent>
    </>
  );
};

export default TagsContent;
