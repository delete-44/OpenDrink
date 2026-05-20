import { CardContextProps, CardProviderProps } from "@/src/types";
import { createContext, useEffect, useState } from "react";
import { Card } from "../models/Card";
import {
  CardPermittedFields,
  CardRepository,
} from "../repositories/CardRepository";

export const CardContext = createContext({} as CardContextProps);

export function CardProvider({ deck, children }: CardProviderProps) {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    if (!deck) {
      setCards([]);
      return;
    }

    setCards(deck?.ncards());
  }, [deck]);

  const createCard = async (deckId: number, patch: CardPermittedFields) => {
    const resp = await CardRepository.create(deckId, patch);

    if (!resp.ok || !resp.payload) {
      throw new Error(resp.message);
    }

    const newCards = [...cards, resp.payload];

    setCards(newCards);
  };

  const createManyCards = async (
    deckId: number,
    patches: CardPermittedFields[],
  ) => {
    const resp = await CardRepository.createMany(deckId, patches);

    if (resp.changes === 0 || !resp.ok) {
      throw new Error(resp.message);
    }

    const newCards = deck!.ncards();

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
