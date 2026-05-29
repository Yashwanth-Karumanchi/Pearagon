// TODO:
// [x] Add API response types
// [ ] Add cache entry types
// [ ] Add CLI input and output types
// [x] Define scaffold message types

export interface SetupMessageGroup {
  verified: string[];
  pending: string[];
}

// Raw response models from the assignment API.
export interface AssignmentBookResponse {
  id: number;
  title: string;
  description: string;
  authors: number[];
}

export interface AssignmentAuthorResponse {
  id: number;
  firstName: string;
  middleInitial?: string;
  lastName: string;
}

// Normalized book data used by the CLI after author names are resolved.
export interface BookSummary {
  id: number;
  title: string;
  description: string;
  authors: string[];
}
