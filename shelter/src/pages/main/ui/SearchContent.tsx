import { IonContent, IonCard, IonCardContent, IonSpinner } from '@ionic/react';
import { SearchBar, useSearch } from '@/features/search-query';
import SearchResults from '@/pages/search/ui/SearchResults';
import { Link } from '@/shared/types/entities';

interface SearchContentProps {
  history: any;
  onTabChange: (tab: string) => void;
}

const SearchContent: React.FC<SearchContentProps> = ({ history, onTabChange }) => {
  const { query, setQuery, results, isSearching, error, clearSearch } = useSearch();

  const handleLinkClick = (link: Link) => {
    history.push(`/link/${link.id}`);
  };

  const handleTagClick = (tag: string) => {
    // 태그 페이지로 전환
    onTabChange('tags');
  };

  return (
    <>
      <IonContent>
        <div className="sticky top-0 z-10 bg-background" style={{ paddingTop: '100px' }}>
          <SearchBar
            value={query}
            onChange={setQuery}
            onClear={clearSearch}
            placeholder="제목, URL, 설명 검색..."
          />
        </div>

        <div className="p-4 pb-32">
          {/* Empty State */}
          {!query && !isSearching && results.length === 0 && (
            <IonCard>
              <IonCardContent>
                <div className="py-8 text-center text-sm text-muted-foreground">
                  검색어를 입력하세요
                  <br />
                  제목, URL, 설명에서 검색합니다
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {/* Loading State */}
          {isSearching && (
            <div className="flex justify-center py-8">
              <IonSpinner />
            </div>
          )}

          {/* Error State */}
          {error && (
            <IonCard>
              <IonCardContent>
                <div className="py-4 text-center text-sm text-destructive">{error}</div>
              </IonCardContent>
            </IonCard>
          )}

          {/* Search Results */}
          {!isSearching && !error && query && (
            <div>
              <div className="mb-3 text-sm text-muted-foreground">{results.length}개의 결과</div>
              <SearchResults
                results={results}
                query={query}
                onLinkClick={handleLinkClick}
                onTagClick={handleTagClick}
              />
            </div>
          )}
        </div>
      </IonContent>
    </>
  );
};

export default SearchContent;
