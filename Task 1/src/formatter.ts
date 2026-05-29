import type { BookSummary, SetupMessageGroup } from "./types";

export function formatStartupMessage(
  appName: string,
  messages: SetupMessageGroup,
): string {
  return [appName, ...messages.verified].join("\n");
}

export function formatBookSummary(
  book: BookSummary | null,
  searchedTitle: string,
): string {
  if (!book) {
    return `No book found for "${searchedTitle}".`;
  }

  // Always show at least one author line so the terminal output stays complete.
  const authorNames = book.authors.length > 0 ? book.authors : ["Unknown author"];

  // Keep the result easy to scan in a plain terminal session.
  return [
    `Book found for "${searchedTitle}"`,
    "",
    `Title: ${book.title}`,
    `ID: ${book.id}`,
    `Description: ${book.description}`,
    "Authors:",
    ...authorNames.map((authorName) => `- ${authorName}`),
  ].join("\n");
}
