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
  private readonly CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7일
  private memoryCache = new Map<string, { data: OGMetadata; timestamp: number }>();

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

      // 메모리 캐시 확인
      const cached = this.memoryCache.get(url);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION_MS) {
        console.log('✅ OG 메타데이터 캐시 사용:', url);
        return {
          success: true,
          data: cached.data,
        };
      }

      // CORS 프록시를 통해 HTML 가져오기 (타임아웃 포함)
      const html = await this.fetchWithTimeout(url);
      const metadata = this.parseOGTags(html);

      // 캐시에 저장
      this.memoryCache.set(url, {
        data: metadata,
        timestamp: Date.now(),
      });

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
