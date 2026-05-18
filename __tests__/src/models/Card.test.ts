import { CardFactory } from "@/factories/models/CardFactory";
import { Card } from "@/src/models/Card";
import { TCardData } from "@/src/types";

describe("Card", () => {
  describe("#toJson", () => {
    it("converts a Card to a JSON object", () => {
      const card = CardFactory();

      expect(card.toJson()).toEqual({
        id: card.id,
        deck_id: card.deck_id,
        content: card.content,
        created_at: card.created_at,
        updated_at: card.updated_at,
      });
    });
  });

  describe("#fromJson", () => {
    it("generates a Card from a JSON object", () => {
      const cardData = {
        id: 2,
        deck_id: 1,
        content: "Drink up",
        created_at: "1970-01-01",
        updated_at: "1970-01-02",
      } as TCardData;

      const card = Card.fromJson(cardData);

      expect(card.id).toEqual(2);
      expect(card.deck_id).toEqual(1);
      expect(card.content).toEqual("Drink up");
      expect(card.created_at).toEqual("1970-01-01");
      expect(card.updated_at).toEqual("1970-01-02");
    });
  });
});
