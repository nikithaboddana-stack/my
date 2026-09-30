import { API_CONFIG } from '../config/api_config';

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
  retries?: number;
  signal?: AbortSignal;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  latencyMs: number;
}

export interface ApiLogEntry {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  status: number;
  statusText: string;
  latencyMs: number;
  timestamp: string;
  success: boolean;
  errorMessage?: string;
  requestBody?: unknown;
  responseBody?: unknown;
}

// Telemetry listeners for UI inspection
type ApiLogListener = (logs: ApiLogEntry[]) => void;
const apiLogs: ApiLogEntry[] = [];
const logListeners: Set<ApiLogListener> = new Set();

export function subscribeApiLogs(listener: ApiLogListener): () => void {
  logListeners.add(listener);
  listener([...apiLogs]);
  return () => {
    logListeners.delete(listener);
  };
}

export function getApiLogs(): ApiLogEntry[] {
  return [...apiLogs];
}

export function clearApiLogs(): void {
  apiLogs.length = 0;
  logListeners.forEach((fn) => fn([]));
}

function recordLog(entry: ApiLogEntry) {
  apiLogs.unshift(entry);
  if (apiLogs.length > 50) {
    apiLogs.pop();
  }
  logListeners.forEach((fn) => fn([...apiLogs]));
}

export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public details?: unknown;
  public isNetworkError: boolean;
  public isTimeout: boolean;

  constructor(
    message: string,
    status: number = 0,
    statusText: string = 'Network Error',
    details?: unknown,
    isNetworkError = false,
    isTimeout = false
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.details = details;
    this.isNetworkError = isNetworkError;
    this.isTimeout = isTimeout;
  }
}

export class ApiService {
  private defaultBaseUrl: string;

  constructor(baseUrl: string = API_CONFIG.baseUrl) {
    this.defaultBaseUrl = baseUrl;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>, baseUrl?: string): string {
    const root = baseUrl || this.defaultBaseUrl;
    const cleanEndpoint = endpoint.startsWith('http') ? endpoint : `${root.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    
    if (!params || Object.keys(params).length === 0) {
      return cleanEndpoint;
    }

    const url = new URL(cleanEndpoint);
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        url.searchParams.append(key, String(val));
      }
    });
    return url.toString();
  }

  public async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
    customBaseUrl?: string
  ): Promise<ApiResponse<T>> {
    const fullUrl = this.buildUrl(endpoint, options?.params, customBaseUrl);
    const timeout = options?.timeoutMs ?? API_CONFIG.timeoutMs;
    const maxRetries = options?.retries ?? API_CONFIG.maxRetries;

    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt <= maxRetries) {
      const startTime = performance.now();
      const controller = new AbortController();
      let timedOut = false;

      const timeoutId = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, timeout);

      try {
        const headers: Record<string, string> = {
          Accept: 'application/json',
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...API_CONFIG.customHeaders,
          ...options?.headers,
        };

        if (API_CONFIG.apiKey) {
          headers['Authorization'] = `Bearer ${API_CONFIG.apiKey}`;
        }

        const fetchOptions: RequestInit = {
          method,
          headers,
          signal: options?.signal ? options.signal : controller.signal,
          ...(body ? { body: JSON.stringify(body) } : {}),
        };

        const response = await fetch(fullUrl, fetchOptions);
        clearTimeout(timeoutId);
        const latencyMs = Math.round(performance.now() - startTime);

        // Status code validation
        if (!response.ok) {
          let errorPayload: unknown = null;
          try {
            errorPayload = await response.json();
          } catch {
            try {
              errorPayload = await response.text();
            } catch {
              // ignore
            }
          }

          let friendlyMessage = `Request failed with HTTP status ${response.status} (${response.statusText})`;
          if (response.status === 404) {
            friendlyMessage = 'The requested resource was not found (404).';
          } else if (response.status === 401 || response.status === 403) {
            friendlyMessage = 'Authentication or permission required to access this service.';
          } else if (response.status >= 500) {
            friendlyMessage = 'External service is temporarily experiencing difficulties. Please try again.';
          }

          recordLog({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            method,
            url: fullUrl,
            status: response.status,
            statusText: response.statusText,
            latencyMs,
            timestamp: new Date().toISOString(),
            success: false,
            errorMessage: friendlyMessage,
            requestBody: body,
            responseBody: errorPayload,
          });

          // Retry on 5xx or rate limit if attempts remain
          if ((response.status >= 500 || response.status === 429) && attempt < maxRetries) {
            attempt++;
            await new Promise((r) => setTimeout(r, API_CONFIG.retryDelayMs * attempt));
            continue;
          }

          throw new ApiError(friendlyMessage, response.status, response.statusText, errorPayload);
        }

        // Parse JSON safely
        let data: T;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = (await response.json()) as T;
        } else {
          const text = await response.text();
          try {
            data = JSON.parse(text) as T;
          } catch {
            data = text as unknown as T;
          }
        }

        recordLog({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          method,
          url: fullUrl,
          status: response.status,
          statusText: response.statusText,
          latencyMs,
          timestamp: new Date().toISOString(),
          success: true,
          requestBody: body,
          responseBody: typeof data === 'object' ? data : { result: data },
        });

        return {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          latencyMs,
        };
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        const latencyMs = Math.round(performance.now() - startTime);

        if (err instanceof ApiError) {
          throw err;
        }

        const isTimeoutError = timedOut || (err instanceof Error && err.name === 'AbortError');
        const errorMessage = isTimeoutError
          ? 'Network request timed out. Please check your internet connection.'
          : 'Unable to reach the remote server. Network connection may be offline.';

        lastError = new ApiError(errorMessage, 0, isTimeoutError ? 'Timeout' : 'Network Error', err, !isTimeoutError, isTimeoutError);

        if (attempt < maxRetries) {
          attempt++;
          await new Promise((r) => setTimeout(r, API_CONFIG.retryDelayMs * attempt));
          continue;
        }

        recordLog({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          method,
          url: fullUrl,
          status: 0,
          statusText: isTimeoutError ? 'Timeout' : 'Offline / Failed',
          latencyMs,
          timestamp: new Date().toISOString(),
          success: false,
          errorMessage,
          requestBody: body,
        });

        throw lastError;
      }
    }

    throw lastError || new ApiError('Failed to execute request after retries', 0);
  }

  // Convenient REST Verbs
  public get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, { ...options, params });
  }

  public post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, body, options);
  }

  public put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, body, options);
  }

  public delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }
}

// Global default api service instance
export const apiService = new ApiService();
