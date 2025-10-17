import { getDB } from '../db';
import type { OGCache } from '../db';

/**
 * Open Graph 메타데이터 타입
 */
export interface OGMetadata {
  title: string | null;
  description: string | null;
  image: string | null;
  url: string | null;
}

/**
 * OG 태그 파싱 결과
 */
export interface OGResult {
  success: boolean;
  data?: OGMetadata;
  error?: string;
}

class OGService {
  private readonly TIMEOUT_MS = 8000; // 8초 타임아웃
  private memoryCache = new Map<string, OGMetadata>(); // 빠른 접근용 메모리 캐시

  /**
   * URL에서 OG 메타데이터 가져오기
   * CORS 문제를 피하기 위해 CORS 프록시 사용
   */
  async fetchOGMetadata(url: string): Promise<OGResult> {
    try {
      // URL 유효성 검증
      if (!url || !this.isValidUrl(url)) {
        return {
          success: false,
          error: '유효하지 않은 URL입니다',
        };
      }

      // 1. 메모리 캐시 확인 (가장 빠름)
      const memoryCached = this.memoryCache.get(url);
      if (memoryCached) {
        console.log('✅ OG 메타데이터 메모리 캐시 사용:', url);
        return {
          success: true,
          data: memoryCached,
        };
      }

      // 2. IndexedDB 캐시 확인 (영구 저장)
      const db = await getDB();
      const dbCached = await db.get('ogCache', url);
      if (dbCached) {
        console.log('✅ OG 메타데이터 IndexedDB 캐시 사용:', url);
        const metadata: OGMetadata = {
          title: dbCached.title,
          description: null,
          image: dbCached.image,
          url: null,
        };

        // 메모리 캐시에도 저장
        this.memoryCache.set(url, metadata);

        return {
          success: true,
          data: metadata,
        };
      }

      // 3. 캐시가 없으면 네트워크에서 가져오기
      console.log('🔄 OG 메타데이터 새로 가져오는 중:', url);
      const html = await this.fetchWithTimeout(url);
      const metadata = this.parseOGTags(html);

      // 4. IndexedDB와 메모리 캐시 모두에 저장
      const cacheEntry: OGCache = {
        url,
        title: metadata.title,
        image: metadata.image,
        cachedAt: Date.now(),
      };

      await db.put('ogCache', cacheEntry);
      this.memoryCache.set(url, metadata);

      console.log('✅ OG 메타데이터 캐시에 저장됨:', url);

      return {
        success: true,
        data: metadata,
      };
    } catch (error) {
      console.error('Failed to fetch OG metadata:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다',
      };
    }
  }

  /**
   * 타임아웃이 있는 fetch
   */
  private async fetchWithTimeout(url: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      // 여러 프록시를 시도 (빠른 것 우선)
      const proxies = [
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      ];

      let lastError: Error | null = null;

      for (const proxyUrl of proxies) {
        try {
          console.log('🔄 OG 태그 가져오는 중:', proxyUrl);
          const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
              Accept: 'text/html',
            },
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const html = await response.text();
          console.log('✅ OG 태그 가져오기 성공');
          return html;
        } catch (error) {
          console.warn('⚠️ 프록시 실패, 다음 시도:', error);
          lastError = error instanceof Error ? error : new Error('Unknown error');
        }
      }

      throw lastError || new Error('모든 프록시 시도 실패');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * HTML에서 OG 태그 파싱
   */
  private parseOGTags(html: string): OGMetadata {
    const metadata: OGMetadata = {
      title: null,
      description: null,
      image: null,
      url: null,
    };

    // og:title 추출
    const titleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
    if (titleMatch) {
      metadata.title = this.decodeHtmlEntities(titleMatch[1]);
    }

    // 대체: <title> 태그 사용
    if (!metadata.title) {
      const titleTagMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleTagMatch) {
        metadata.title = this.decodeHtmlEntities(titleTagMatch[1]);
      }
    }

    // og:description 추출
    const descMatch = html.match(
      /<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i
    );
    if (descMatch) {
      metadata.description = this.decodeHtmlEntities(descMatch[1]);
    }

    // 대체: <meta name="description"> 사용
    if (!metadata.description) {
      const metaDescMatch = html.match(
        /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i
      );
      if (metaDescMatch) {
        metadata.description = this.decodeHtmlEntities(metaDescMatch[1]);
      }
    }

    // og:image 추출
    const imageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    if (imageMatch) {
      metadata.image = imageMatch[1];
    }

    // og:url 추출
    const urlMatch = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i);
    if (urlMatch) {
      metadata.url = urlMatch[1];
    }

    return metadata;
  }

  /**
   * HTML 엔티티 디코딩
   */
  private decodeHtmlEntities(text: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  /**
   * URL 유효성 검증
   */
  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }
}

export const ogService = new OGService();
