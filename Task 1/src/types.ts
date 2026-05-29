export interface SetupMessageGroup {
  verified: string[];
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
