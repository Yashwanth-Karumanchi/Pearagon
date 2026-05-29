import NodeCache from "node-cache";

import type { AssignmentAuthorResponse, BookSummary } from "./types";

const DEFAULT_CACHE_TTL_SECONDS = 86400;

// Fall back to the default TTL whenever the environment value is missing or invalid.
function getCacheTtlSeconds(): number {
  const rawTtlValue = process.env.CACHE_TTL_SECONDS;

  if (!rawTtlValue) {
    return DEFAULT_CACHE_TTL_SECONDS;
  }

  const parsedTtlValue = Number(rawTtlValue);

  if (!Number.isFinite(parsedTtlValue) || parsedTtlValue <= 0) {
    return DEFAULT_CACHE_TTL_SECONDS;
  }

  return parsedTtlValue;
}

export const booksCache = new NodeCache({
  stdTTL: getCacheTtlSeconds(),
});

export function buildCacheKey(scope: string, value: string | number): string {
  return `${scope}:${String(value)}`;
}

export function hasCachedValue(cacheKey: string): boolean {
  return booksCache.has(cacheKey);
}

export function getCachedBook(cacheKey: string): BookSummary | null | undefined {
  return booksCache.get<BookSummary | null>(cacheKey);
}

export function setCachedBook(cacheKey: string, book: BookSummary | null): void {
  booksCache.set(cacheKey, book);
}

export function getCachedAuthor(
  cacheKey: string,
): AssignmentAuthorResponse | null | undefined {
  return booksCache.get<AssignmentAuthorResponse | null>(cacheKey);
}

export function setCachedAuthor(
  cacheKey: string,
  author: AssignmentAuthorResponse | null,
): void {
  booksCache.set(cacheKey, author);
}
