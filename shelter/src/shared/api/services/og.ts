import { getDB } from '../db';
import type { OGCache } from '../db';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import * as cheerio from 'cheerio';

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
  private readonly TIMEOUT_MS = 10000; // 10초 타임아웃
  private memoryCache = new Map<string, OGMetadata>(); // 빠른 접근용 메모리 캐시

  /**
   * URL에서 OG 메타데이터 가져오기
   * 네이티브 앱: @capacitor-community/http 사용 (CORS 제한 없음)
   * 웹: CORS 프록시 사용
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
      const html = await this.fetchHTML(url);
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

      console.log('✅ OG 메타데이터 캐시에 저장됨:', url, metadata);

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
   * HTML 가져오기
   * 네이티브 플랫폼: @capacitor-community/http 사용
   * 웹 플랫폼: CORS 프록시 사용
   */
  private async fetchHTML(url: string): Promise<string> {
    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
      // 네이티브 앱: @capacitor-community/http 사용 (CORS 제한 없음)
      return this.fetchHTMLNative(url);
    } else {
      // 웹: CORS 프록시 사용
      return this.fetchHTMLWeb(url);
    }
  }

  /**
   * 네이티브 플랫폼에서 HTML 가져오기
   * @capacitor-community/http 사용 (CORS 제한 없음)
   */
  private async fetchHTMLNative(url: string): Promise<string> {
    console.log('📱 네이티브 HTTP로 OG 태그 가져오는 중:', url);

    try {
      const response = await CapacitorHttp.get({
        url,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,ko;q=0.8',
        },
        readTimeout: this.TIMEOUT_MS,
        connectTimeout: this.TIMEOUT_MS,
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html =
        typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      console.log('✅ 네이티브 HTTP로 OG 태그 가져오기 성공 (HTML 길이:', html.length, ')');

      return html;
    } catch (error) {
      console.error('❌ 네이티브 HTTP 요청 실패:', error);
      throw error;
    }
  }

  /**
   * 웹 플랫폼에서 HTML 가져오기
   * CORS 프록시 사용
   */
  private async fetchHTMLWeb(url: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      // 여러 프록시를 시도 (안정적인 것 우선)
      const proxies = [
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      ];

      let lastError: Error | null = null;

      for (let i = 0; i < proxies.length; i++) {
        const proxyUrl = proxies[i];
        try {
          console.log(
            `🌐 웹 프록시로 OG 태그 가져오는 중 (프록시 ${i + 1}/${proxies.length}):`,
            proxyUrl
          );
          const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
              Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const html = await response.text();
          console.log(
            `✅ 웹 프록시로 OG 태그 가져오기 성공 (프록시 ${i + 1} 사용, HTML 길이: ${html.length})`
          );
          return html;
        } catch (error) {
          console.warn(`⚠️ 프록시 ${i + 1} 실패, 다음 시도:`, error);
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
   * cheerio 라이브러리를 사용하여 안정적으로 파싱
   */
  private parseOGTags(html: string): OGMetadata {
    const metadata: OGMetadata = {
      title: null,
      description: null,
      image: null,
      url: null,
    };

    try {
      const $ = cheerio.load(html);

      // og:title 추출
      let title =
        $('meta[property="og:title"]').attr('content') ||
        $('meta[name="og:title"]').attr('content');

      // twitter:title 대체
      if (!title) {
        title =
          $('meta[property="twitter:title"]').attr('content') ||
          $('meta[name="twitter:title"]').attr('content');
      }

      // <title> 태그 대체
      if (!title) {
        title = $('title').text();
      }

      metadata.title = title ? title.trim() : null;

      // og:description 추출
      let description =
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="og:description"]').attr('content');

      // twitter:description 대체
      if (!description) {
        description =
          $('meta[property="twitter:description"]').attr('content') ||
          $('meta[name="twitter:description"]').attr('content');
      }

      // <meta name="description"> 대체
      if (!description) {
        description = $('meta[name="description"]').attr('content');
      }

      metadata.description = description ? description.trim() : null;

      // og:image 추출
      let image =
        $('meta[property="og:image"]').attr('content') ||
        $('meta[name="og:image"]').attr('content');

      // twitter:image 대체
      if (!image) {
        image =
          $('meta[property="twitter:image"]').attr('content') ||
          $('meta[name="twitter:image"]').attr('content');
      }

      metadata.image = image ? image.trim() : null;

      // og:url 추출
      const ogUrl =
        $('meta[property="og:url"]').attr('content') || $('meta[name="og:url"]').attr('content');

      metadata.url = ogUrl ? ogUrl.trim() : null;

      console.log('📊 OG 태그 파싱 결과:', metadata);

      return metadata;
    } catch (error) {
      console.error('❌ OG 태그 파싱 실패:', error);
      // 파싱 실패 시 빈 메타데이터 반환
      return metadata;
    }
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
