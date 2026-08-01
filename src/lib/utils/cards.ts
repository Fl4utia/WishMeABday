// StoredCardData describes the shape of a saved card document (server-side persisted).
export interface StoredCardData {
  id: string;
  name: string;
  email: string;
  birthday?: string;
  cardType?: string | null;
  message: string;
  link: string;
  createdAt: string;
  mode?: string;
  sendAt?: string;
}

// Local storage is intentionally removed for cards in the application. Cards must be
// persisted to Firestore via the server API. This file keeps only the type so other
// modules can import the shape if needed; storage helpers have been removed.

