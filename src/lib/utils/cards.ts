export interface StoredCardData {
  id: string;
  name: string;
  email: string;
  birthday: string;
  cardType?: string | null;
  message: string;
  link: string;
  createdAt: string;
  mode?: string;
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
