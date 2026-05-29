// TODO:
// [x] Add API client configuration
// [x] Add request methods
// [x] Add error handling for remote calls
// [x] Reserve API client scaffold surface

import axios from "axios";

import { API_BASE_URL } from "./config";
import type {
  AssignmentAuthorResponse,
  AssignmentBookResponse,
  BookSummary,
} from "./types";

function formatAuthorName(author: AssignmentAuthorResponse): string {
  const nameParts = [author.firstName];

  if (author.middleInitial) {
    nameParts.push(author.middleInitial);
  }

  nameParts.push(author.lastName);

  return nameParts.join(" ");
}

function isNotFoundError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}

function createApiError(message: string): Error {
  return new Error(message);
}

export function createBooksApiClient() {
  async function fetchBookByTitle(
    cleanedTitle: string,
  ): Promise<AssignmentBookResponse | null> {
    try {
      const response = await axios.post<AssignmentBookResponse>(
        `${API_BASE_URL}/books/search`,
        { title: cleanedTitle },
      );

      return response.data;
    } catch (error) {
      if (isNotFoundError(error)) {
        return null;
      }

      throw createApiError("Unable to search for the requested book right now.");
    }
  }

  async function fetchAuthorById(
    authorId: number,
  ): Promise<AssignmentAuthorResponse | null> {
    try {
      const response = await axios.get<AssignmentAuthorResponse>(
        `${API_BASE_URL}/authors/${authorId}`,
      );

      return response.data;
    } catch (error) {
      if (isNotFoundError(error)) {
        return null;
      }

      throw createApiError("Unable to load book author details right now.");
    }
  }

  return {
    async searchBookByTitle(bookTitle: string): Promise<BookSummary | null> {
      const cleanedTitle = bookTitle.trim();

      if (!cleanedTitle) {
        return null;
      }

      const book = await fetchBookByTitle(cleanedTitle);

      if (!book) {
        return null;
      }

      // Resolve each unique author once before building the final summary.
      const uniqueAuthorIds = [...new Set(book.authors)];

      if (uniqueAuthorIds.length === 0) {
        return {
          id: book.id,
          title: book.title,
          description: book.description,
          authors: ["Unknown author"],
        };
      }

      const authors = await Promise.all(
        uniqueAuthorIds.map((authorId) => fetchAuthorById(authorId)),
      );

      // Keep normal not-found behavior quiet while still returning usable output.
      const authorNames = authors
        .filter(
          (author): author is AssignmentAuthorResponse => author !== null,
        )
        .map(formatAuthorName);

      return {
        id: book.id,
        title: book.title,
        description: book.description,
        authors: authorNames.length > 0 ? authorNames : ["Unknown author"],
      };
    },
  };
}
