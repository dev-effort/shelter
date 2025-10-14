import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Folder, Link, Tag, Settings } from '@/shared/types/entities';

// IndexedDB Schema 정의
// @ts-ignore - DBSchema 타입 정의 문제 회피
interface ShelterDB extends DBSchema {
  folders: {
    key: string;
    value: Folder;
    indexes: { 'by-parent': string | null; 'by-updated': number };
  };
  links: {
    key: string;
    value: Link;
    indexes: { 'by-folder': string; 'by-updated': number; 'by-accessed': number };
  };
  tags: {
    key: string;
    value: Tag;
    indexes: { 'by-count': number; 'by-updated': number };
  };
  settings: {
    key: string;
    value: Settings;
  };
}

const DB_NAME = 'shelter-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<ShelterDB> | null = null;

/**
 * IndexedDB 초기화 및 마이그레이션
 */
export async function initDB(): Promise<IDBPDatabase<ShelterDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<ShelterDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      console.log(`Upgrading DB from version ${oldVersion} to ${newVersion}`);

      // Folders Object Store
      if (!db.objectStoreNames.contains('folders')) {
        const folderStore = db.createObjectStore('folders', { keyPath: 'id' });
        folderStore.createIndex('by-parent', 'parentId');
        folderStore.createIndex('by-updated', 'updatedAt');
      }

      // Links Object Store
      if (!db.objectStoreNames.contains('links')) {
        const linkStore = db.createObjectStore('links', { keyPath: 'id' });
        linkStore.createIndex('by-folder', 'folderId');
        linkStore.createIndex('by-updated', 'updatedAt');
        linkStore.createIndex('by-accessed', 'lastAccessedAt');
      }

      // Tags Object Store
      if (!db.objectStoreNames.contains('tags')) {
        const tagStore = db.createObjectStore('tags', { keyPath: 'id' });
        tagStore.createIndex('by-count', 'count');
        tagStore.createIndex('by-updated', 'updatedAt');
      }

      // Settings Object Store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    },
  });

  // 기본 설정 초기화
  await initializeDefaultSettings(dbInstance);

  return dbInstance;
}

/**
 * 기본 설정 초기화
 */
async function initializeDefaultSettings(db: IDBPDatabase<ShelterDB>): Promise<void> {
  const existingSettings = await db.get('settings', 'user-settings');

  if (!existingSettings) {
    // 설정이 없으면 기본값으로 생성
    const defaultSettings: Settings = {
      id: 'user-settings',
      viewMode: 'list',
      theme: 'dark',
      defaultSortBy: 'updatedAt',
      defaultSortOrder: 'desc',
      appVersion: '1.0.0',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.put('settings', defaultSettings);
  } else {
    // 기존 설정이 있지만 theme이 제대로 설정되지 않은 경우 업데이트
    let needsUpdate = false;
    const updatedSettings = { ...existingSettings };

    // theme이 없거나 잘못된 경우
    if (
      !updatedSettings.theme ||
      (updatedSettings.theme !== 'light' && updatedSettings.theme !== 'dark')
    ) {
      updatedSettings.theme = 'dark';
      needsUpdate = true;
    }

    // 다른 필수 필드가 없는 경우도 체크
    if (!updatedSettings.viewMode) {
      updatedSettings.viewMode = 'list';
      needsUpdate = true;
    }
    if (!updatedSettings.defaultSortBy) {
      updatedSettings.defaultSortBy = 'updatedAt';
      needsUpdate = true;
    }
    if (!updatedSettings.defaultSortOrder) {
      updatedSettings.defaultSortOrder = 'desc';
      needsUpdate = true;
    }

    if (needsUpdate) {
      updatedSettings.updatedAt = Date.now();
      await db.put('settings', updatedSettings);
      console.log('Settings updated with default values');
    }
  }
}

/**
 * DB 인스턴스 가져오기
 */
export async function getDB(): Promise<IDBPDatabase<ShelterDB>> {
  if (!dbInstance) {
    return await initDB();
  }
  return dbInstance;
}

/**
 * DB 초기화 (개발/테스트용)
 */
export async function clearDB(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['folders', 'links', 'tags', 'settings'], 'readwrite');

  await Promise.all([
    tx.objectStore('folders').clear(),
    tx.objectStore('links').clear(),
    tx.objectStore('tags').clear(),
    // settings는 초기화하지 않음
  ]);

  await tx.done;
}

/**
 * DB 연결 종료
 */
export function closeDB(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

// 자동 초기화 (앱 시작 시)
if (typeof window !== 'undefined') {
  initDB().catch((error) => {
    console.error('Failed to initialize IndexedDB:', error);
  });
}
