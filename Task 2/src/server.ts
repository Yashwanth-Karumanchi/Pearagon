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
  const maxIncrementBy = Number.MAX_SAFE_INTEGER - currentCount;

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

  if (incrementBy <= 0) {
    response.status(400).json({
      error: "The increment value must be greater than 0.",
    });
    return;
  }

  if (maxIncrementBy <= 0) {
    response.status(400).json({
      error: "The maximum count has been reached. No increment is possible.",
    });
    return;
  }

  if (!Number.isSafeInteger(incrementBy)) {
    response.status(400).json({
      error: `The increment value must be a whole number between 1 and ${maxIncrementBy}.`,
    });
    return;
  }

  if (incrementBy > maxIncrementBy) {
    response.status(400).json({
      error: `The increment value must be between 1 and ${maxIncrementBy} for the current count.`,
    });
    return;
  }

  // Keep the count on the server so the same value survives page refreshes.
  currentCount += incrementBy;

  response.json({ count: currentCount });
});

app.listen(port, () => {
  console.log(`Task 2 server is running on http://localhost:${port}`);
});
