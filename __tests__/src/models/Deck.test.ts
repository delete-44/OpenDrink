import { Deck, TDeckData } from "@/src/models/Deck";

describe("Deck", () => {
  beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.123456789);
    jest.spyOn(global.Date, "now").mockReturnValue(1);
  });

  it("generates a unique ID on instantiation", () => {
    const deck = new Deck("Test deck", []);

    expect(deck.id).toEqual("1_0.123456789");
  });

  describe("#toJson", () => {
    it("converts a Deck to a JSON object", () => {
      const deck = new Deck("Test Deck", [], "123");

      expect(deck.toJson()).toEqual({
        id: "123",
        name: "Test Deck",
        cards: [],
      });
    });
  });

  describe("#fromJson", () => {
    it("generates a Deck from a JSON object", () => {
      const deckData = {
        id: "123",
        name: "Test Deck",
        cards: [],
      } as TDeckData;

      const deck = Deck.fromJson(deckData);

      expect(deck.id).toEqual("123");
      expect(deck.name).toEqual("Test Deck");
      expect(deck.cards).toEqual([]);
    });
  });
});
