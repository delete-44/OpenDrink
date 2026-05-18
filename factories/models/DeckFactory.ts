import { Deck } from "@/src/models/Deck";
import { TDeckData } from "@/src/types";

export function DeckFactory(overrides: Partial<TDeckData> = {}) {
  return new Deck({
    id: 1,
    name: "Test Deck",
    created_at: "1970-01-01",
    updated_at: "1970-01-02",

    // TODO: Remove
    cards: ["Test Card 1"],
    ...overrides,
  });
}
