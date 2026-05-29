// TODO:
// [x] Create Express server setup
// [x] Serve static frontend files
// [x] Serve the root page
// [ ] Add count routes
// [ ] Add request validation for count updates

import path from "node:path";

import express from "express";

const app = express();
const port = Number(process.env.PORT) || 3000;
const publicDirectoryPath = path.resolve(process.cwd(), "public");
const indexHtmlPath = path.join(publicDirectoryPath, "index.html");

app.use(express.static(publicDirectoryPath));

app.get("/", (_request, response) => {
  response.sendFile(indexHtmlPath);
});

app.listen(port, () => {
  console.log(`Task 2 server is running on http://localhost:${port}`);
});
