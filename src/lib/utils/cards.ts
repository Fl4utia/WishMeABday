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
  // Client-only flags to manage local fallback/sync behavior
  pending?: boolean; // true when item was only saved locally and needs server sync
  emailPending?: boolean; // true when an immediate email should be sent after server sync
  [key: string]: unknown;
}

const STORAGE_KEY = "wishmeabday.cards";

function getStoredCards(): StoredCardData[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue) as StoredCardData[];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.warn("Unable to read stored cards", error);
    return [];
  }
}

function saveStoredCards(cards: StoredCardData[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export function saveCardData(cardData: StoredCardData): StoredCardData {
  const cards = getStoredCards();
  const filteredCards = cards.filter((card) => card.id !== cardData.id);
  const nextCards = [cardData, ...filteredCards].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  saveStoredCards(nextCards);
  return cardData;
}

export function getStoredCardData(id: string): StoredCardData | null {
  return getStoredCards().find((card) => card.id === id) ?? null;
}

export function getAllStoredCards(): StoredCardData[] {
  return getStoredCards();
}

export function deleteStoredCard(id: string): void {
  const cards = getStoredCards().filter((card) => card.id !== id);
  saveStoredCards(cards);
}

// New helpers for syncing pending local cards to the server
export function getPendingStoredCards(): StoredCardData[] {
  return getStoredCards().filter((card) => card.pending === true);
}

export function markStoredCardAsSynced(id: string, serverData?: Partial<StoredCardData>): void {
  const cards = getStoredCards();
  const next = cards.map((card) => {
    if (card.id !== id) return card;
    const updated = { ...card, ...(serverData ?? {}) };
    delete (updated as Partial<StoredCardData>).pending;
    delete (updated as Partial<StoredCardData>).emailPending;
    return updated;
  });
  saveStoredCards(next);
}

export function markStoredCardEmailSent(id: string): void {
  const cards = getStoredCards();
  const next = cards.map((card) => {
    if (card.id !== id) return card;
    return { ...card, emailPending: false };
  });
  saveStoredCards(next);
}
