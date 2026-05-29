# Pearagon Task 2

Task 2 is a TypeScript Express server that serves a small vanilla frontend from the `public/` directory and exposes a simple in-memory count API.

## Install

`npm install`

## Run

`npm start`

## Development

`npm run dev`

## Current backend

The server compiles TypeScript into `dist/`, serves static files from `public/`, returns `index.html` at `/`, and keeps an in-memory count that starts at `0`.

- `GET /count`
  Returns the current count as JSON:
  `{ "count": number }`

- `POST /increment`
  Accepts JSON in the form:
  `{ "value": number }`
  and returns the updated count as JSON.

Multiply will be handled from the frontend using `/increment`, not a separate route.

Frontend button behavior is intentionally not implemented yet.
