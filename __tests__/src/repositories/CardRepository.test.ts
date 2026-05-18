import { CardFactory } from "@/factories/models/CardFactory";
import { DeckFactory } from "@/factories/models/DeckFactory";
import SQLiteDatabaseFactory from "@/factories/SQLiteDatabaseFactory";
import { CardRepository } from "@/src/repositories/CardRepository";

describe("CardRepository", () => {
  const mockGetAllAsync = jest.fn();
  const mockRunAsync = jest.fn();

  const deck = DeckFactory();

  const db = SQLiteDatabaseFactory({
    getAllAsync: mockGetAllAsync,
    runAsync: mockRunAsync,
  });

  describe("before initialisation", () => {
    it("errors out on index", async () => {
      const result = await CardRepository.index(deck.id);

      expect(result.ok).toEqual(false);
      expect(result.message).toEqual("Error loading Cards");
      expect(result.payload).toEqual(undefined);
    });

    it("errors out on create", async () => {
      const result = await CardRepository.create(deck.id, {
        content: "Drink twice",
      });

      expect(result.ok).toEqual(false);
      expect(result.message).toEqual("Error creating Card");
      expect(result.payload).toEqual(undefined);
    });

    it("errors out on delete", async () => {
      const result = await CardRepository.delete(1);

      expect(result.ok).toEqual(false);
      expect(result.message).toEqual("Error deleting Card");
      expect(result.changes).toEqual(0);
    });
  });

  describe("once initialised", () => {
    beforeEach(() => {
      CardRepository.initialise(db);
    });

    describe("when db call fails", () => {
      it("errors out on index", async () => {
        mockGetAllAsync.mockRejectedValueOnce(new Error("test error"));

        const result = await CardRepository.index(deck.id);

        expect(result.ok).toEqual(false);
        expect(result.message).toEqual("Error loading Cards");
        expect(result.payload).toEqual(undefined);
      });

      it("errors out on create", async () => {
        mockRunAsync.mockRejectedValueOnce(new Error("test error"));

        const result = await CardRepository.create(deck.id, {
          content: "Drink twice",
        });

        expect(result.ok).toEqual(false);
        expect(result.message).toEqual("Error creating Card");
        expect(result.payload).toEqual(undefined);
      });

      it("errors out on delete", async () => {
        mockRunAsync.mockRejectedValueOnce(new Error("test error"));

        const result = await CardRepository.delete(1);

        expect(result.ok).toEqual(false);
        expect(result.message).toEqual("Error deleting Card");
        expect(result.changes).toEqual(0);
      });
    });

    describe("on success", () => {
      const card1 = CardFactory({ id: 1, content: "Drink once" });
      const card2 = CardFactory({ id: 2, content: "Drink twice" });
      const card3 = CardFactory({ id: 3, content: "Drink thrice" });

      it("#index returns a collection of cards", async () => {
        mockGetAllAsync.mockResolvedValueOnce([card1, card2, card3]);

        const result = await CardRepository.index(deck.id);

        expect(mockGetAllAsync).toHaveBeenCalledWith(
          "SELECT * FROM cards WHERE deck_id=?",
          deck.id,
        );

        expect(result.ok).toEqual(true);
        expect(result.message).toEqual(undefined);
        expect(result.payload).toEqual([card1, card2, card3]);
      });

      it("#create returns the new cards id + content", async () => {
        mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: 4 });

        const result = await CardRepository.create(deck.id, {
          content: "Drink again",
        });

        expect(mockRunAsync).toHaveBeenCalledWith(
          'INSERT INTO cards ("deck_id", "content") VALUES (?, ?)',
          deck.id,
          "Drink again",
        );

        expect(result.ok).toEqual(true);
        expect(result.message).toEqual(undefined);
        expect(result.payload).toEqual({ id: 4, content: "Drink again" });
      });

      describe("#delete", () => {
        it("shows a friendlier error message if the card is not found", async () => {
          mockRunAsync.mockResolvedValueOnce({ changes: 0 });

          const result = await CardRepository.delete(1);

          expect(mockRunAsync).toHaveBeenCalledWith(
            "DELETE FROM cards WHERE id=?",
            1,
          );

          expect(result.ok).toEqual(false);
          expect(result.message).toEqual("Card 1 not found");
          expect(result.changes).toEqual(0);
        });

        it("returns the number of deleted cards", async () => {
          mockRunAsync.mockResolvedValueOnce({ changes: 1 });

          const result = await CardRepository.delete(1);

          expect(mockRunAsync).toHaveBeenCalledWith(
            "DELETE FROM cards WHERE id=?",
            1,
          );

          expect(result.ok).toEqual(true);
          expect(result.message).toEqual(undefined);
          expect(result.changes).toEqual(1);
        });
      });
    });
  });
});
