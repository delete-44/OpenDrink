import { CardFactory } from "@/factories/models/CardFactory";
import { DeckFactory } from "@/factories/models/DeckFactory";
import SQLiteDatabaseFactory from "@/factories/SQLiteDatabaseFactory";
import { CardRepository } from "@/src/repositories/CardRepository";

describe("CardRepository", () => {
  const mockGetAllSync = jest.fn();
  const mockGetFirstAsync = jest.fn();
  const mockRunAsync = jest.fn();
  const mockWithTransactionAsync = jest.fn((callback) => callback());

  const deck = DeckFactory();

  const db = SQLiteDatabaseFactory({
    getAllSync: mockGetAllSync,
    getFirstAsync: mockGetFirstAsync,
    runAsync: mockRunAsync,
    withTransactionAsync: mockWithTransactionAsync,
  });

  describe("before initialisation", () => {
    it("errors out on index", () => {
      const result = CardRepository.index(deck.id);

      expect(result.ok).toEqual(false);
      expect(result.message).toEqual(
        "Repository must be initialised with the .initialise function before use",
      );
      expect(result.payload).toEqual([]);
    });

    it("errors out on create", async () => {
      const result = await CardRepository.create(deck.id, {
        content: "Drink twice",
      });

      expect(result.ok).toEqual(false);
      expect(result.message).toEqual(
        "Repository must be initialised with the .initialise function before use",
      );
      expect(result.payload).toEqual(undefined);
    });

    it("errors out on createMany", async () => {
      const result = await CardRepository.createMany(deck.id, [
        {
          content: "Drink twice",
        },
        { content: "Drink thrice" },
      ]);

      expect(result.ok).toEqual(false);
      expect(result.message).toEqual(
        "Repository must be initialised with the .initialise function before use",
      );
      expect(result.changes).toEqual(0);
    });

    it("errors out on delete", async () => {
      const result = await CardRepository.delete(1);

      expect(result.ok).toEqual(false);
      expect(result.message).toEqual(
        "Repository must be initialised with the .initialise function before use",
      );
      expect(result.changes).toEqual(0);
    });
  });

  describe("once initialised", () => {
    beforeEach(() => {
      CardRepository.initialise(db);
    });

    describe("when db call fails", () => {
      it("errors out on index", async () => {
        mockGetAllSync.mockImplementationOnce(() => new Error("test error"));

        const result = CardRepository.index(deck.id);

        expect(result.ok).toEqual(false);
        expect(result.message).toEqual("Error loading Cards");
        expect(result.payload).toEqual([]);
      });

      describe("#create", () => {
        it("errors out on create request", async () => {
          mockRunAsync.mockRejectedValueOnce(new Error("test error"));

          const result = await CardRepository.create(deck.id, {
            content: "Default",
          });

          expect(result.ok).toEqual(false);
          expect(result.message).toEqual("Error creating Card");
          expect(result.payload).toEqual(undefined);
        });

        it("errors out on find request", async () => {
          mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: 1 });
          mockGetFirstAsync.mockRejectedValueOnce(new Error("test error"));

          const result = await CardRepository.create(deck.id, {
            content: "Default",
          });

          expect(result.ok).toEqual(false);
          expect(result.message).toEqual("Error creating Card");
          expect(result.payload).toEqual(undefined);
        });

        it("returns friendly message if card not found", async () => {
          mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: 1 });
          mockGetFirstAsync.mockResolvedValueOnce(null);

          const result = await CardRepository.create(deck.id, {
            content: "Default",
          });

          expect(result.ok).toEqual(false);
          expect(result.message).toEqual("Card not found");
          expect(result.payload).toEqual(undefined);
        });
      });

      describe("#createMany", () => {
        it("errors out on transaction initialisation", async () => {
          mockWithTransactionAsync.mockRejectedValueOnce(
            new Error("test error"),
          );

          const result = await CardRepository.createMany(deck.id, [
            {
              content: "Drink 1",
            },
          ]);

          expect(result.ok).toEqual(false);
          expect(result.message).toEqual("Error creating Cards");
          expect(result.changes).toEqual(0);
        });

        it("errors out on first create request", async () => {
          mockRunAsync.mockRejectedValueOnce(new Error("test error"));

          const result = await CardRepository.createMany(deck.id, [
            {
              content: "Drink 1",
            },
          ]);

          expect(result.ok).toEqual(false);
          expect(result.message).toEqual("Error creating Cards");
          expect(result.changes).toEqual(0);
        });

        it("errors out on subsequent create request", async () => {
          mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: 1 });
          mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: 2 });
          mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: 3 });
          mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: 4 });
          mockRunAsync.mockRejectedValueOnce(new Error("test error"));

          const result = await CardRepository.createMany(deck.id, [
            { content: "Drink 1" },
            { content: "Drink 2" },
            { content: "Drink 3" },
            { content: "Drink 4" },
            { content: "Error card!" },
          ]);

          expect(result.ok).toEqual(false);
          expect(result.message).toEqual("Error creating Cards");
          expect(result.changes).toEqual(0);
        });
      });

      it("errors out on delete", async () => {
        mockRunAsync.mockRejectedValueOnce(new Error("test error"));

        const result = await CardRepository.delete(1);

        expect(result.ok).toEqual(false);
        expect(result.message).toEqual("Error deleting Card");
        expect(result.changes).toEqual(0);
      });
    });

    describe("validation errors", () => {
      describe("#create", () => {
        it("returns a custom error message if content is empty", async () => {
          const result = await CardRepository.create(1, { content: "" });

          expect(mockRunAsync).not.toHaveBeenCalled();
          expect(mockGetFirstAsync).not.toHaveBeenCalled();

          expect(result.ok).toEqual(false);
          expect(result.message).toEqual("Card cannot be empty");
          expect(result.payload).toEqual(undefined);
        });

        it("returns a custom error message if content is too long", async () => {
          const content = "1".repeat(501);
          const result = await CardRepository.create(1, { content });

          expect(mockRunAsync).not.toHaveBeenCalled();
          expect(mockGetFirstAsync).not.toHaveBeenCalled();

          expect(result.ok).toEqual(false);
          expect(result.message).toEqual("Maximum length is 500 characters");
          expect(result.payload).toEqual(undefined);
        });
      });
    });

    describe("on success", () => {
      const card1 = CardFactory({ id: 1, content: "Drink once" });
      const card2 = CardFactory({ id: 2, content: "Drink twice" });
      const card3 = CardFactory({ id: 3, content: "Drink thrice" });

      it("#index returns a collection of cards", () => {
        mockGetAllSync.mockReturnValueOnce([card1, card2, card3]);

        const result = CardRepository.index(deck.id);

        expect(mockGetAllSync).toHaveBeenCalledWith(
          "SELECT * FROM cards WHERE deck_id=?",
          deck.id,
        );

        expect(result.ok).toEqual(true);
        expect(result.message).toEqual(undefined);
        expect(result.payload).toEqual([card1, card2, card3]);
      });

      describe("#create", () => {
        it("trims whitespace from the card content", async () => {
          mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: card3.id });
          mockGetFirstAsync.mockResolvedValueOnce(card3);

          const result = await CardRepository.create(deck.id, {
            content: `     ${card3.content}   `,
          });

          expect(mockRunAsync).toHaveBeenCalledWith(
            'INSERT INTO cards ("deck_id", "content") VALUES (?, ?)',
            deck.id,
            card3.content,
          );

          expect(mockGetFirstAsync).toHaveBeenCalledWith(
            "SELECT * FROM cards WHERE id=?",
            card3.id,
          );

          expect(result.ok).toEqual(true);
          expect(result.message).toEqual(undefined);
          expect(result.payload).toEqual(card3);
        });

        it("creates the new card & fetches it", async () => {
          mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: card3.id });
          mockGetFirstAsync.mockResolvedValueOnce(card3);

          const result = await CardRepository.create(deck.id, {
            content: card3.content,
          });

          expect(mockRunAsync).toHaveBeenCalledWith(
            'INSERT INTO cards ("deck_id", "content") VALUES (?, ?)',
            deck.id,
            card3.content,
          );

          expect(mockGetFirstAsync).toHaveBeenCalledWith(
            "SELECT * FROM cards WHERE id=?",
            card3.id,
          );

          expect(result.ok).toEqual(true);
          expect(result.message).toEqual(undefined);
          expect(result.payload).toEqual(card3);
        });
      });

      it("#createMany creates the new cards & returns sum of changes", async () => {
        mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: 1 });
        mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: 2 });
        mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: 3 });

        const result = await CardRepository.createMany(deck.id, [
          { content: card1.content },
          { content: card2.content },
          { content: card3.content },
        ]);

        expect(mockRunAsync).toHaveBeenCalledTimes(3);

        expect(mockRunAsync).toHaveBeenCalledWith(
          'INSERT INTO cards ("deck_id", "content") VALUES (?, ?)',
          deck.id,
          card1.content,
        );

        expect(mockRunAsync).toHaveBeenCalledWith(
          'INSERT INTO cards ("deck_id", "content") VALUES (?, ?)',
          deck.id,
          card2.content,
        );

        expect(mockRunAsync).toHaveBeenCalledWith(
          'INSERT INTO cards ("deck_id", "content") VALUES (?, ?)',
          deck.id,
          card3.content,
        );

        expect(result.ok).toEqual(true);
        expect(result.message).toEqual(undefined);
        expect(result.changes).toEqual(3);
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
