// TODO:
// [x] Add CLI input handling
// [x] Add API request orchestration
// [ ] Add cache-aware execution flow
// [x] Verify TypeScript CLI scaffold startup output

import readlineSync from "readline-sync";

import { createBooksApiClient } from "./apiClient";
import { APP_NAME, SETUP_MESSAGES } from "./config";
import { formatBookSummary, formatStartupMessage } from "./formatter";

async function main(): Promise<void> {
  const output = formatStartupMessage(APP_NAME, SETUP_MESSAGES);
  const apiClient = createBooksApiClient();

  console.log(output);

  // Read the title after startup so the current verification output stays intact.
  const bookTitle = readlineSync.question("Enter a book title: ").trim();

  if (!bookTitle) {
    console.log("Please enter a valid book title.");
    return;
  }

  try {
    // Search first, then pass the exact searched title into the terminal formatter.
    const book = await apiClient.searchBookByTitle(bookTitle);

    console.log(formatBookSummary(book, bookTitle));
  } catch (error) {
    if (error instanceof Error) {
      console.log("Unable to search for the requested book right now.");
      console.log(`Reason: ${error.message}`);
      return;
    }

    console.log("Unable to search for the requested book right now.");
    console.log("Reason: An unexpected error occurred.");
  }
}

void main();
