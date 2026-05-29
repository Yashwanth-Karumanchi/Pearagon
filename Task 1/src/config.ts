// TODO:
// [ ] Add runtime environment parsing
// [x] Add API configuration values
// [ ] Add cache configuration values
// [x] Define startup message configuration

import type { SetupMessageGroup } from "./types";

export const APP_NAME = "Pearagon Task 1 CLI";

export const API_BASE_URL =
  "https://ejditq67mwuzeuwrlp5fs3egwu0yhkjz.lambda-url.us-east-2.on.aws/api";

export const SETUP_MESSAGES: SetupMessageGroup = {
  verified: [
    "Project setup verified.",
    "TypeScript build is working.",
  ],
  pending: [
    "No API calls yet.",
    "No CLI input yet.",
    "No caching yet.",
  ],
};
