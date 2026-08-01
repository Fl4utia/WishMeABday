import { deleteStoredCard, getAllStoredCards, getStoredCardData, saveCardData } from '../cards';

describe('card storage helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores and retrieves a card by id', () => {
    const card = {
      id: 'card-1',
      name: 'Ada',
      email: 'ada@example.com',
      birthday: '1990-12-01',
      cardType: '1',
      message: 'Happy birthday',
      link: 'https://example.com/card-1',
      createdAt: '2026-01-01T00:00:00.000Z',
    };

    saveCardData(card);

    expect(getStoredCardData('card-1')).toEqual(card);
  });

  it('returns all stored cards', () => {
    saveCardData({
      id: 'card-1',
      name: 'Ada',
      email: 'ada@example.com',
      birthday: '1990-12-01',
      cardType: '1',
      message: 'Happy birthday',
      link: 'https://example.com/card-1',
      createdAt: '2026-01-01T00:00:00.000Z',
    });
    saveCardData({
      id: 'card-2',
      name: 'Grace',
      email: 'grace@example.com',
      birthday: '1995-02-14',
      cardType: '2',
      message: 'Enjoy your day',
      link: 'https://example.com/card-2',
      createdAt: '2026-01-02T00:00:00.000Z',
    });

    expect(getAllStoredCards()).toHaveLength(2);
    expect(getAllStoredCards()[0].id).toBe('card-2');
  });

  it('removes a stored card', () => {
    const card = {
      id: 'card-1',
      name: 'Ada',
      email: 'ada@example.com',
      birthday: '1990-12-01',
      cardType: '1',
      message: 'Happy birthday',
      link: 'https://example.com/card-1',
      createdAt: '2026-01-01T00:00:00.000Z',
    };

    saveCardData(card);
    deleteStoredCard('card-1');

    expect(getStoredCardData('card-1')).toBeNull();
  });
});
