# Pearagon Task 1

Task 1 is a TypeScript CLI that searches the assignment Books API by title and resolves author IDs through the Authors API before printing a readable terminal summary.

## Install

`npm install`

## Run

`npm start`

Optional cache TTL override:

`$env:CACHE_TTL_SECONDS=3600; npm start`

## Behavior

The CLI prints a short startup banner, prompts for a book title, looks up the matching book in the assignment Books API, fetches the related authors from the Authors API, and formats the result for the terminal. After each result, not-found message, blank input message, or readable API error, it prompts again and keeps running until you stop it.

Successful book summaries and author responses are cached in memory with `node-cache` to avoid repeating the same API calls during repeated searches.
