import { CardContextProps, CardProviderProps } from "@/src/types";
import { createContext, useEffect, useState } from "react";
import { Card } from "../models/Card";
import {
  CardPermittedFields,
  CardRepository,
} from "../repositories/CardRepository";

export const CardContext = createContext({} as CardContextProps);

export function CardProvider({ deck, children }: CardProviderProps) {
  const [cards, setCards] = useState<Card[]>(() => {
    return deck ? deck.cards() : [];
  });

  useEffect(() => {
    if (!deck) {
      setCards([]);
      return;
    }

    setCards(deck!.cards());
  }, [deck]);

  const createCard = async (patch: CardPermittedFields) => {
    if (!deck) {
      throw new Error("CardContext must be initialised with a Deck");
    }

    const resp = await CardRepository.create(deck.id, patch);

    if (!resp.ok || !resp.payload) {
      throw new Error(resp.message);
    }

    const newCards = [...cards, resp.payload];

    setCards(newCards);
  };

  const createManyCards = async (patches: CardPermittedFields[]) => {
    if (!deck) {
      throw new Error("CardContext must be initialised with a Deck");
    }

    const resp = await CardRepository.createMany(deck.id, patches);

    if (resp.changes === 0 || !resp.ok) {
      throw new Error(resp.message);
    }

    const newCards = deck!.cards();

    setCards(newCards);
  };

  const deleteCard = async (id: number) => {
    const resp = await CardRepository.delete(id);

    if (resp.changes === 0 || !resp.ok) {
      throw new Error(resp.message);
    }

    const newCards = cards.filter((card) => card.id !== id);
    setCards(newCards);
  };

  const value = {
    deck,
    cards,
    createCard,
    createManyCards,
    deleteCard,
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
}
