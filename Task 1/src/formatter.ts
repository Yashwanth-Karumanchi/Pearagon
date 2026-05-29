// TODO:
// [ ] Add formatted API result output
// [ ] Add user-facing error formatting
// [ ] Add cache status formatting
// [x] Format scaffold startup output

import type { SetupMessageGroup } from "./types";

export function formatStartupMessage(
  appName: string,
  messages: SetupMessageGroup,
): string {
  return [
    appName,
    ...messages.verified,
    "",
    ...messages.pending,
  ].join("\n");
}
