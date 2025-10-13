import { useState } from 'react';
import { useLinkStore } from '@/app/providers/stores';

export function useLinkCreate(folderId: string) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createLink } = useLinkStore();

  const open = () => {
    setIsOpen(true);
    reset();
  };

  const close = () => {
    setIsOpen(false);
    reset();
  };

  const reset = () => {
    setTitle('');
    setUrl('');
    setDescription('');
    setTags([]);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('제목을 입력해주세요');
      return;
    }

    if (!url.trim()) {
      setError('URL을 입력해주세요');
      return;
    }

    // URL 유효성 검사
    try {
      new URL(url.trim());
    } catch {
      setError('올바른 URL을 입력해주세요');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createLink({
        title: title.trim(),
        url: url.trim(),
        description: description.trim(),
        tags,
        folderId,
      });
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : '링크 생성에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return {
    isOpen,
    title,
    url,
    description,
    tags,
    isLoading,
    error,
    setTitle,
    setUrl,
    setDescription,
    addTag,
    removeTag,
    open,
    close,
    handleSubmit,
  };
}
