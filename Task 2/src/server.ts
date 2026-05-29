// TODO:
// [x] Create Express server setup
// [x] Serve static frontend files
// [x] Serve the root page
// [x] Add count routes
// [x] Add request validation for count updates

import path from "node:path";

import express from "express";

const app = express();
const port = Number(process.env.PORT) || 3000;
const publicDirectoryPath = path.resolve(process.cwd(), "public");
const indexHtmlPath = path.join(publicDirectoryPath, "index.html");
let currentCount = 0;

app.use(express.json());
app.use(express.static(publicDirectoryPath));

app.get("/", (_request, response) => {
  response.sendFile(indexHtmlPath);
});

// Return the current in-memory count for the frontend to read.
app.get("/count", (_request, response) => {
  response.json({ count: currentCount });
});

// Validate increment requests before updating the shared count state.
app.post("/increment", (request, response) => {
  const requestBody = request.body as { value?: unknown };
  const incrementBy = requestBody.value;

  if (typeof incrementBy !== "number") {
    response.status(400).json({
      error: "The request body must include a numeric value.",
    });
    return;
  }

  if (!Number.isFinite(incrementBy)) {
    response.status(400).json({
      error: "The increment value must be a finite number.",
    });
    return;
  }

  if (!Number.isSafeInteger(incrementBy)) {
    response.status(400).json({
      error: "The increment value must be a safe integer.",
    });
    return;
  }

  currentCount += incrementBy;

  response.json({ count: currentCount });
});

app.listen(port, () => {
  console.log(`Task 2 server is running on http://localhost:${port}`);
});
