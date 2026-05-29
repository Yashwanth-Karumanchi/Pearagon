# Pearagon Task 2

Task 2 is a TypeScript Express server that serves a small vanilla frontend from the `public/` directory and exposes a simple in-memory count API.

## Install

`npm install`

## Run

`npm start`

## Current backend

The server compiles TypeScript into `dist/`, serves static files from `public/`, returns `index.html` at `/`, and keeps an in-memory count that starts at `0`.

- `GET /count`
  Returns the current count as JSON:
  `{ "count": number }`

- `POST /increment`
  Accepts JSON in the form:
  `{ "value": number }`
  and returns the updated count as JSON.

## Frontend behavior

The page uses only vanilla HTML, CSS, and JavaScript.

On page load, the frontend calls `GET /count` and renders the current count.

The `Increment` button sends `POST /increment` with `{ "value": 1 }`.

The `Multiply` button calculates the required increment in the browser and sends that value through `POST /increment`.

Multiply is handled through `/increment`, not a separate route.
