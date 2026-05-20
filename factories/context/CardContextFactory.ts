import { CardContextProps } from "@/src/types";
import { CardFactory } from "../models/CardFactory";
import { DeckFactory } from "../models/DeckFactory";

const _deck = DeckFactory();

const _cards = [
  CardFactory({ id: 1, deck_id: _deck.id, content: "Drink up!" }),
  CardFactory({ id: 2, deck_id: _deck.id, content: "Drink down!" }),
];

export function CardContextFactory(
  overrides: Partial<CardContextProps>,
): CardContextProps {
  return {
    deck: _deck,
    cards: _cards,
    createCard: jest.fn(),
    createManyCards: jest.fn(),
    deleteCard: jest.fn(),
    ...overrides,
  };
}
