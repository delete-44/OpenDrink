import { PlayerFactory } from "@/factories/models/PlayerFactory";
import SQLiteDatabaseFactory from "@/factories/SQLiteDatabaseFactory";
import { PlayerRepository } from "@/src/repositories/PlayerRepository";

describe("PlayerRepository", () => {
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
      const result = await PlayerRepository.index();

      expect(result.ok).toEqual(false);
      expect(result.message).toEqual("Error loading Players");
      expect(result.payload).toEqual([]);
    });

    it("errors out on create", async () => {
      const result = await PlayerRepository.create({ name: "Alice" });

      expect(result.ok).toEqual(false);
      expect(result.message).toEqual("Error creating Player");
      expect(result.payload).toEqual(undefined);
    });

    it("errors out on delete", async () => {
      const result = await PlayerRepository.delete(1);

      expect(result.ok).toEqual(false);
      expect(result.message).toEqual("Error deleting Player");
      expect(result.changes).toEqual(0);
    });
  });

  describe("once initialised", () => {
    beforeEach(() => {
      PlayerRepository.initialise(db);
    });

    describe("when db call fails", () => {
      it("errors out on index", async () => {
        mockGetAllAsync.mockRejectedValueOnce(new Error("test error"));

        const result = await PlayerRepository.index();

        expect(result.ok).toEqual(false);
        expect(result.message).toEqual("Error loading Players");
        expect(result.payload).toEqual([]);
      });

      describe("#create", () => {
        it("errors out on create request", async () => {
          mockRunAsync.mockRejectedValueOnce(new Error("test error"));

          const result = await PlayerRepository.create({ name: "Alice" });

          expect(result.ok).toEqual(false);
          expect(result.message).toEqual("Error creating Player");
          expect(result.payload).toEqual(undefined);
        });

        it("errors out on find request", async () => {
          mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: 1 });
          mockGetFirstAsync.mockRejectedValueOnce(new Error("test error"));

          const result = await PlayerRepository.create({ name: "Alice" });

          expect(result.ok).toEqual(false);
          expect(result.message).toEqual("Error creating Player");
          expect(result.payload).toEqual(undefined);
        });

        it("returns friendly message if player not found", async () => {
          mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: 1 });
          mockGetFirstAsync.mockResolvedValueOnce(null);

          const result = await PlayerRepository.create({ name: "Alice" });

          expect(result.ok).toEqual(false);
          expect(result.message).toEqual("Player not found");
          expect(result.payload).toEqual(undefined);
        });
      });

      it("errors out on delete", async () => {
        mockRunAsync.mockRejectedValueOnce(new Error("test error"));

        const result = await PlayerRepository.delete(1);

        expect(result.ok).toEqual(false);
        expect(result.message).toEqual("Error deleting Player");
        expect(result.changes).toEqual(0);
      });
    });

    describe("validation errors", () => {
      describe("#create", () => {
        it("returns a custom error message if name is empty", async () => {
          const result = await PlayerRepository.create({ name: "" });

          expect(mockRunAsync).not.toHaveBeenCalled();
          expect(mockGetFirstAsync).not.toHaveBeenCalled();

          expect(result.ok).toEqual(false);
          expect(result.message).toEqual("Player name cannot be empty");
          expect(result.payload).toEqual(undefined);
        });

        it("returns a custom error message if name is too long", async () => {
          const name = "1".repeat(101);
          const result = await PlayerRepository.create({ name });

          expect(mockRunAsync).not.toHaveBeenCalled();
          expect(mockGetFirstAsync).not.toHaveBeenCalled();

          expect(result.ok).toEqual(false);
          expect(result.message).toEqual("Maximum length is 100 characters");
          expect(result.payload).toEqual(undefined);
        });
      });
    });

    describe("on success", () => {
      const player1 = PlayerFactory({ id: 1, name: "Sally" });
      const player2 = PlayerFactory({ id: 2, name: "Alice" });
      const player3 = PlayerFactory({ id: 3, name: "Rincewind" });

      it("#index returns a collection of players", async () => {
        mockGetAllAsync.mockResolvedValueOnce([player1, player2, player3]);

        const result = await PlayerRepository.index();

        expect(mockGetAllAsync).toHaveBeenCalledWith("SELECT * FROM players");

        expect(result.ok).toEqual(true);
        expect(result.message).toEqual(undefined);
        expect(result.payload).toEqual([player1, player2, player3]);
      });

      it("#create creates the new player & fetches it", async () => {
        mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: player3.id });
        mockGetFirstAsync.mockResolvedValueOnce(player3);

        const result = await PlayerRepository.create({ name: player3.name });

        expect(mockRunAsync).toHaveBeenCalledWith(
          'INSERT INTO players ("name") VALUES (?)',
          player3.name,
        );

        expect(mockGetFirstAsync).toHaveBeenCalledWith(
          "SELECT * FROM players WHERE id=?",
          player3.id,
        );

        expect(result.ok).toEqual(true);
        expect(result.message).toEqual(undefined);
        expect(result.payload).toEqual(player3);
      });

      describe("#delete", () => {
        it("shows a friendlier error message if the player is not found", async () => {
          mockRunAsync.mockResolvedValueOnce({ changes: 0 });

          const result = await PlayerRepository.delete(1);

          expect(mockRunAsync).toHaveBeenCalledWith(
            "DELETE FROM players WHERE id=?",
            1,
          );

          expect(result.ok).toEqual(false);
          expect(result.message).toEqual("Player 1 not found");
          expect(result.changes).toEqual(0);
        });

        it("returns the number of deleted players", async () => {
          mockRunAsync.mockResolvedValueOnce({ changes: 1 });

          const result = await PlayerRepository.delete(1);

          expect(mockRunAsync).toHaveBeenCalledWith(
            "DELETE FROM players WHERE id=?",
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
