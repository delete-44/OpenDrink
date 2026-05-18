import { DeckFactory } from "@/factories/models/DeckFactory";
import SQLiteDatabaseFactory from "@/factories/SQLiteDatabaseFactory";
import { DeckRepository } from "@/src/repositories/DeckRepository";

describe("DeckRepository", () => {
  const mockGetAllAsync = jest.fn();
  const mockGetFirstAsync = jest.fn();
  const mockRunAsync = jest.fn();

  const db = SQLiteDatabaseFactory({
    getAllAsync: mockGetAllAsync,
    getFirstAsync: mockGetFirstAsync,
    runAsync: mockRunAsync,
  });

  describe("before initialisation", () => {
    it("errors out on index", async () => {
      const result = await DeckRepository.index();

      expect(result.ok).toEqual(false);
      expect(result.message).toEqual("Error loading Decks");
      expect(result.payload).toEqual(undefined);
    });

    it("errors out on find", async () => {
      const result = await DeckRepository.find(1);

      expect(result.ok).toEqual(false);
      expect(result.message).toEqual("Error loading Deck");
      expect(result.payload).toEqual(undefined);
    });

    it("errors out on create", async () => {
      const result = await DeckRepository.create({ name: "Default" });

      expect(result.ok).toEqual(false);
      expect(result.message).toEqual("Error creating Deck");
      expect(result.payload).toEqual(undefined);
    });

    it("errors out on update", async () => {
      const result = await DeckRepository.update(1, { name: "Default" });

      expect(result.ok).toEqual(false);
      expect(result.message).toEqual("Error updating Deck");
      expect(result.changes).toEqual(0);
    });

    it("errors out on delete", async () => {
      const result = await DeckRepository.delete(1);

      expect(result.ok).toEqual(false);
      expect(result.message).toEqual("Error deleting Deck");
      expect(result.changes).toEqual(0);
    });
  });

  describe("once initialised", () => {
    beforeEach(() => {
      DeckRepository.initialise(db);
    });

    describe("when db call fails", () => {
      it("errors out on index", async () => {
        mockGetAllAsync.mockRejectedValueOnce(new Error("test error"));

        const result = await DeckRepository.index();

        expect(result.ok).toEqual(false);
        expect(result.message).toEqual("Error loading Decks");
        expect(result.payload).toEqual(undefined);
      });

      it("errors out on find", async () => {
        mockGetFirstAsync.mockRejectedValueOnce(new Error("test error"));

        const result = await DeckRepository.find(1);

        expect(result.ok).toEqual(false);
        expect(result.message).toEqual("Error loading Deck");
        expect(result.payload).toEqual(undefined);
      });

      it("errors out on create", async () => {
        mockRunAsync.mockRejectedValueOnce(new Error("test error"));

        const result = await DeckRepository.create({ name: "Default" });

        expect(result.ok).toEqual(false);
        expect(result.message).toEqual("Error creating Deck");
        expect(result.payload).toEqual(undefined);
      });

      it("errors out on update", async () => {
        mockRunAsync.mockRejectedValueOnce(new Error("test error"));

        const result = await DeckRepository.update(1, { name: "Default" });

        expect(result.ok).toEqual(false);
        expect(result.message).toEqual("Error updating Deck");
        expect(result.changes).toEqual(0);
      });

      it("errors out on delete", async () => {
        mockRunAsync.mockRejectedValueOnce(new Error("test error"));

        const result = await DeckRepository.delete(1);

        expect(result.ok).toEqual(false);
        expect(result.message).toEqual("Error deleting Deck");
        expect(result.changes).toEqual(0);
      });
    });

    describe("on success", () => {
      const deck1 = DeckFactory({ id: 1, name: "Default" });
      const deck2 = DeckFactory({ id: 2, name: "Hardcore" });
      const deck3 = DeckFactory({ id: 3, name: "Quiet" });

      it("#index returns a collection of decks", async () => {
        mockGetAllAsync.mockResolvedValueOnce([deck1, deck2, deck3]);

        const result = await DeckRepository.index();

        expect(mockGetAllAsync).toHaveBeenCalledWith("SELECT * FROM decks");

        expect(result.ok).toEqual(true);
        expect(result.message).toEqual(undefined);
        expect(result.payload).toEqual([deck1, deck2, deck3]);
      });

      describe("#find", () => {
        it("shows a friendlier error message if the deck is not found", async () => {
          mockGetFirstAsync.mockResolvedValueOnce(null);

          const result = await DeckRepository.find(3);

          expect(mockGetFirstAsync).toHaveBeenCalledWith(
            "SELECT * FROM decks WHERE id=?",
            3,
          );

          expect(result.ok).toEqual(false);
          expect(result.message).toEqual("Deck 3 not found");
          expect(result.payload).toEqual(undefined);
        });

        it("returns the found deck", async () => {
          mockGetFirstAsync.mockResolvedValueOnce(deck3);

          const result = await DeckRepository.find(3);

          expect(mockGetFirstAsync).toHaveBeenCalledWith(
            "SELECT * FROM decks WHERE id=?",
            3,
          );

          expect(result.ok).toEqual(true);
          expect(result.message).toEqual(undefined);
          expect(result.payload).toEqual(deck3);
        });
      });

      it("#create returns the created decks name + id", async () => {
        mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: 4 });

        const result = await DeckRepository.create({ name: "My deck" });

        expect(mockRunAsync).toHaveBeenCalledWith(
          'INSERT INTO decks ("name") VALUES (?)',
          "My deck",
        );

        expect(result.ok).toEqual(true);
        expect(result.message).toEqual(undefined);
        expect(result.payload).toEqual({ id: 4, name: "My deck" });
      });

      describe("#update", () => {
        it("shows a friendlier error message if the deck is not found", async () => {
          mockRunAsync.mockResolvedValueOnce({ changes: 0 });

          const result = await DeckRepository.update(3, {
            name: "My updated deck",
          });

          expect(mockRunAsync).toHaveBeenCalledWith(
            "UPDATE decks SET name=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
            "My updated deck",
            3,
          );

          expect(result.ok).toEqual(false);
          expect(result.message).toEqual("Deck 3 not found");
          expect(result.changes).toEqual(0);
        });

        it("returns the number of changes", async () => {
          mockRunAsync.mockResolvedValueOnce({ changes: 1 });

          const result = await DeckRepository.update(3, {
            name: "My updated deck",
          });

          expect(mockRunAsync).toHaveBeenCalledWith(
            "UPDATE decks SET name=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
            "My updated deck",
            3,
          );

          expect(result.ok).toEqual(true);
          expect(result.message).toEqual(undefined);
          expect(result.changes).toEqual(1);
        });
      });

      describe("#delete", () => {
        it("shows a friendlier error message if the deck is not found", async () => {
          mockRunAsync.mockResolvedValueOnce({ changes: 0 });

          const result = await DeckRepository.delete(1);

          expect(mockRunAsync).toHaveBeenCalledWith(
            "DELETE FROM decks WHERE id=?",
            1,
          );

          expect(result.ok).toEqual(false);
          expect(result.message).toEqual("Deck 1 not found");
          expect(result.changes).toEqual(0);
        });

        it("returns the number of deleted decks", async () => {
          mockRunAsync.mockResolvedValueOnce({ changes: 1 });

          const result = await DeckRepository.delete(1);

          expect(mockRunAsync).toHaveBeenCalledWith(
            "DELETE FROM decks WHERE id=?",
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
