import { DeckFactory } from "@/factories/models/DeckFactory";
import { Deck } from "@/src/models/Deck";
import { TDeckData } from "@/src/types";

describe("Deck", () => {
  describe("#toJson", () => {
    it("converts a Deck to a JSON object", () => {
      const deck = DeckFactory();

      expect(deck.toJson()).toEqual({
        id: deck.id,
        name: deck.name,
        created_at: deck.created_at,
        updated_at: deck.updated_at,
        cards: deck.cards,
      });
    });
  });

  describe("#fromJson", () => {
    it("generates a Deck from a JSON object", () => {
      const deckData = {
        id: 1,
        name: "Test Deck",
        cards: [],
      } as TDeckData;

      const deck = Deck.fromJson(deckData);

      expect(deck.id).toEqual(1);
      expect(deck.name).toEqual("Test Deck");
      expect(deck.cards).toEqual([]);
    });
  });
});
