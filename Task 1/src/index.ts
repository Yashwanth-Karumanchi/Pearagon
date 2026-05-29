// TODO:
// [ ] Add CLI input handling
// [ ] Add API request orchestration
// [ ] Add cache-aware execution flow
// [x] Verify TypeScript CLI scaffold startup output

import { APP_NAME, SETUP_MESSAGES } from "./config";
import { formatStartupMessage } from "./formatter";

function main(): void {
  const output = formatStartupMessage(APP_NAME, SETUP_MESSAGES);

  console.log(output);
}

main();
