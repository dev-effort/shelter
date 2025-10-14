import { useState, useEffect } from 'react';
import { useLinkStore } from '@/app/providers/stores';
import { Link } from '@/shared/types/entities';

/**
 * 태그 필터링 Hook
 */
export function useTagFilter() {
  const { links, loadLinks } = useLinkStore();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<Link[]>([]);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredLinks([]);
    } else {
      // 선택된 모든 태그를 포함하는 링크만 필터링
      const filtered = links.filter((link) => selectedTags.every((tag) => link.tags.includes(tag)));
      setFilteredLinks(filtered);
    }
  }, [selectedTags, links]);

  /**
   * 태그 선택/해제
   */
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  /**
   * 태그 추가
   */
  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  /**
   * 태그 제거
   */
  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  /**
   * 모든 태그 초기화
   */
  const clearTags = () => {
    setSelectedTags([]);
  };

  /**
   * 태그가 선택되어 있는지 확인
   */
  const isTagSelected = (tag: string) => {
    return selectedTags.includes(tag);
  };

  return {
    selectedTags,
    filteredLinks,
    toggleTag,
    addTag,
    removeTag,
    clearTags,
    isTagSelected,
  };
}
