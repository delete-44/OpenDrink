import { Deck } from "@/src/models/Deck";
import { createContext, useContext } from "react";

export const DeckLayoutContext = createContext<Deck | null>(null);

export function useDeckFromLayout() {
  const deck = useContext(DeckLayoutContext);

  if (!deck) {
    throw new Error("useDeckFromLayout must be used within DeckLayout");
  }

  return deck;
}
