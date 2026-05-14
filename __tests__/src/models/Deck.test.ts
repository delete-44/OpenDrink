import { Deck } from "@/src/models/Deck";
import { BaseMockDb } from "@/test-utils";
import { SQLiteDatabase } from "expo-sqlite";

describe("Deck", () => {
  const mockGetAllAsync = jest.fn();

  const mockDeckData = {
    id: 1,
    name: "Test Deck",
    created_at: "0000000",
    updated_at: "0000000",
    cards: [],
  };

  const mockDeckData2 = {
    id: 2,
    name: "Test Deck 2",
    created_at: "0000001",
    updated_at: "0000001",
    cards: [],
  };

  const db = {
    ...BaseMockDb,
    getAllAsync: mockGetAllAsync,
  } as SQLiteDatabase;

  describe("#toJson", () => {
    it("converts a Deck to a JSON object", () => {
      const deck = new Deck("Test Deck", [], 1, "0000000", "0000000");

      expect(deck.toJson()).toEqual(mockDeckData);
    });
  });

  describe("#fromJson", () => {
    it("generates a Deck from a JSON object", () => {
      const deck = Deck.fromJson(mockDeckData);

      expect(deck.id).toEqual(1);
      expect(deck.name).toEqual("Test Deck");
      expect(deck.cards).toEqual([]);
    });
  });

  describe("#index", () => {
    it("queries DB correctly", async () => {
      mockGetAllAsync.mockResolvedValueOnce([mockDeckData, mockDeckData2]);

      const result = await Deck.index(db);

      expect(mockGetAllAsync).toHaveBeenCalledWith("SELECT * FROM decks");

      expect(result).toEqual([
        Deck.fromJson(mockDeckData),
        Deck.fromJson(mockDeckData2),
      ]);
    });
  });
});
