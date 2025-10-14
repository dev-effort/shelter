import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonSpinner,
} from '@ionic/react';
import { NavigationBar } from '@/widgets/navigation-bar';
import { useTagStore } from '@/app/providers/stores';
import { useTagFilter, TagBadge } from '@/features/tag-filter';
import TaggedLinksView from './TaggedLinksView';

const TagsPage: React.FC = () => {
  const history = useHistory();
  const { tags, isLoading, loadTags } = useTagStore();
  const { selectedTags, filteredLinks, toggleTag, removeTag, clearTags } = useTagFilter();

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  const handleNavigate = (route: string) => {
    history.push(route);
  };

  // 태그를 개수 순으로 정렬
  const sortedTags = [...tags].sort((a, b) => b.count - a.count);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>태그</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="space-y-4 p-4 pb-20">
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

      <NavigationBar onNavigate={handleNavigate} />
    </IonPage>
  );
};

export default TagsPage;
