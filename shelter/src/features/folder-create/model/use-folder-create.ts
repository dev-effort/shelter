import { useState } from 'react';
import { useFolderStore } from '@/app/providers/stores';

export function useFolderCreate(parentId: string | null = null) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createFolder } = useFolderStore();

  const open = () => {
    setIsOpen(true);
    setName('');
    setError(null);
  };

  const close = () => {
    setIsOpen(false);
    setName('');
    setError(null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('폴더 이름을 입력해주세요');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createFolder({ name: name.trim(), parentId });
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : '폴더 생성에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    name,
    isLoading,
    error,
    setName,
    open,
    close,
    handleSubmit,
  };
}
