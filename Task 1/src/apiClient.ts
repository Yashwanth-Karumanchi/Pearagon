import axios from "axios";

import {
  buildCacheKey,
  getCachedAuthor,
  getCachedBook,
  hasCachedValue,
  setCachedAuthor,
  setCachedBook,
} from "./cache";
import { API_BASE_URL } from "./config";
import type {
  AssignmentAuthorResponse,
  AssignmentBookResponse,
  BookSummary,
} from "./types";

function collapseBookTitleSpacing(bookTitle: string): string {
  return bookTitle.trim().replace(/\s+/g, " ");
}

function formatAuthorName(author: AssignmentAuthorResponse): string {
  const nameParts = [author.firstName];

  if (author.middleInitial) {
    nameParts.push(author.middleInitial);
  }

  nameParts.push(author.lastName);

  return nameParts.join(" ");
}

function getApiErrorMessageFromStatus(status: number, resourceName: string): string {
  if (status === 400) {
    return `Book search failed. Error code: 400. The API rejected the ${resourceName} request.`;
  }

  if (status === 401) {
    return `Book search failed. Error code: 401. The API rejected the ${resourceName} request.`;
  }

  if (status === 403) {
    return `Book search failed. Error code: 403. The API rejected the ${resourceName} request.`;
  }

  if (status === 404) {
    return `Book search failed. Error code: 404. The requested ${resourceName} was not found.`;
  }

  if (status === 429) {
    return `Book search failed. Error code: 429. The API rate-limited the ${resourceName} request.`;
  }

  if (status >= 500) {
    return `Book search failed. Error code: ${status}. The API failed while loading the ${resourceName}.`;
  }

  return `Book search failed. Error code: ${status}. The API responded unexpectedly while loading the ${resourceName}.`;
}

// Convert transport failures into messages the CLI can show directly.
function getApiFailureReason(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (!axios.isAxiosError(error)) {
    return "Book search failed. Error code: APP_ERROR. The application encountered an unexpected error.";
  }

  if (error.response) {
    return `Book search failed. Error code: ${error.response.status}. The API responded with an error.`;
  }

  if (error.request) {
    return "Book search failed. Error code: NETWORK. The API did not respond.";
  }

  if (error.message) {
    return `Book search failed. Error code: REQUEST_ERROR. ${error.message}`;
  }

  return "Book search failed. Error code: REQUEST_ERROR. The request could not be completed.";
}

export function createBooksApiClient() {
  async function fetchBookByTitle(
    cleanedTitle: string,
  ): Promise<AssignmentBookResponse | null> {
    try {
      const response = await axios.post<AssignmentBookResponse>(
        `${API_BASE_URL}/books/search`,
        { title: cleanedTitle },
        {
          validateStatus: () => true,
        },
      );

      // The assignment books endpoint can treat a missing title as a non-2xx miss.
      if (response.status === 400 || response.status === 404) {
        return null;
      }

      if (response.status < 200 || response.status >= 300) {
        throw new Error(getApiErrorMessageFromStatus(response.status, "book search"));
      }

      return response.data;
    } catch (error) {
      throw new Error(getApiFailureReason(error));
    }
  }

  async function fetchAuthorById(
    authorId: number,
  ): Promise<AssignmentAuthorResponse | null> {
    const cacheKey = buildCacheKey("author", authorId);

    if (hasCachedValue(cacheKey)) {
      return getCachedAuthor(cacheKey) ?? null;
    }

    try {
      const response = await axios.get<AssignmentAuthorResponse>(
        `${API_BASE_URL}/authors/${authorId}`,
        {
          validateStatus: () => true,
        },
      );

      if (response.status === 404) {
        setCachedAuthor(cacheKey, null);
        return null;
      }

      if (response.status < 200 || response.status >= 300) {
        throw new Error(getApiErrorMessageFromStatus(response.status, "author"));
      }

      // Keep successful author lookups around to avoid repeating the same request.
      setCachedAuthor(cacheKey, response.data);

      return response.data;
    } catch (error) {
      throw new Error(getApiFailureReason(error));
    }
  }

  return {
    async searchBookByTitle(bookTitle: string): Promise<BookSummary | null> {
      const cleanedTitle = collapseBookTitleSpacing(bookTitle);

      if (!cleanedTitle) {
        return null;
      }

      const bookCacheKey = buildCacheKey("book", cleanedTitle);

      if (hasCachedValue(bookCacheKey)) {
        return getCachedBook(bookCacheKey) ?? null;
      }

      const book = await fetchBookByTitle(cleanedTitle);

      if (!book) {
        setCachedBook(bookCacheKey, null);
        return null;
      }

      // Resolve each unique author once before building the final summary.
      const uniqueAuthorIds = [...new Set(book.authors)];

      if (uniqueAuthorIds.length === 0) {
        const bookSummary = {
          id: book.id,
          title: book.title,
          description: book.description,
          authors: ["Unknown author"],
        };

        setCachedBook(bookCacheKey, bookSummary);

        return bookSummary;
      }

      // Load each referenced author so the CLI can print readable names.
      const authors = await Promise.all(
        uniqueAuthorIds.map((authorId) => fetchAuthorById(authorId)),
      );

      // Keep normal not-found behavior quiet while still returning usable output.
      const authorNames = authors
        .filter(
          (author): author is AssignmentAuthorResponse => author !== null,
        )
        .map(formatAuthorName);

      const bookSummary = {
        id: book.id,
        title: book.title,
        description: book.description,
        authors: authorNames.length > 0 ? authorNames : ["Unknown author"],
      };

      // Cache the finished summary so repeated title searches can skip the API work.
      setCachedBook(bookCacheKey, bookSummary);

      return bookSummary;
    },
  };
}
