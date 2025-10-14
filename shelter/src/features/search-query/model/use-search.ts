import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/shared/lib/hooks/use-debounce';
import { linkService } from '@/shared/api/services/link';
import { Link } from '@/shared/types/entities';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Link[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce the search query (300ms delay)
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const performSearch = async () => {
      // Don't search if query is empty
      if (!debouncedQuery.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const searchResults = await linkService.search(debouncedQuery);
        setResults(searchResults);
      } catch (err) {
        console.error('Search error:', err);
        setError('검색 중 오류가 발생했습니다.');
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    error,
    clearSearch,
  };
}
