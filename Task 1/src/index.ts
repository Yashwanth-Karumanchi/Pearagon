import readlineSync from "readline-sync";

import { createBooksApiClient } from "./apiClient";
import { APP_NAME, SETUP_MESSAGES } from "./config";
import { formatBookSummary, formatStartupMessage } from "./formatter";

async function main(): Promise<void> {
  const apiClient = createBooksApiClient();

  console.log(formatStartupMessage(APP_NAME, SETUP_MESSAGES));

  while (true) {
    const bookTitle = readlineSync.question("Enter a book title: ").trim();

    if (!bookTitle) {
      console.log("Please enter a valid book title.");
      continue;
    }

    // Keep the CLI failure output readable without exposing stack traces.
    try {
      const book = await apiClient.searchBookByTitle(bookTitle);

      console.log(formatBookSummary(book, bookTitle));
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        continue;
      }

      console.log(
        "Book search failed. Error code: APP_ERROR. The application encountered an unexpected error.",
      );
    }
  }
}

void main();
