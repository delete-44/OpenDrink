import { DeckFactory } from "@/factories/models/DeckFactory";
import { PlayerFactory } from "@/factories/models/PlayerFactory";
import { StorageContext, StorageProvider } from "@/src/context/StorageContext";
import { CardRepository } from "@/src/repositories/CardRepository";
import { DeckRepository } from "@/src/repositories/DeckRepository";
import { PlayerRepository } from "@/src/repositories/PlayerRepository";
import { renderHook, waitFor } from "@testing-library/react-native";
import { Storage } from "expo-sqlite/kv-store";
import { act, useContext } from "react";

jest.mock("expo-sqlite", () => ({
  useSQLiteContext: jest.fn(),
}));

describe("StorageProvider", () => {
  const renderStorageContext = async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StorageProvider>{children}</StorageProvider>
    );

    const { result } = renderHook(() => useContext(StorageContext), {
      wrapper,
    });

    // Wait for data to load to prevent race conditions in test
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    return result;
  };

  beforeEach(() => {
    jest.spyOn(Storage, "getItemAsync").mockResolvedValueOnce("0");
  });

  it("initialises repositories", async () => {
    jest.spyOn(PlayerRepository, "initialise");
    jest.spyOn(DeckRepository, "initialise");
    jest.spyOn(CardRepository, "initialise");

    await renderStorageContext();

    expect(PlayerRepository.initialise).toHaveBeenCalledTimes(1);
    expect(DeckRepository.initialise).toHaveBeenCalledTimes(1);
    expect(CardRepository.initialise).toHaveBeenCalledTimes(1);
  });

  it("defaults to empty collection of decks if none found", async () => {
    const storageContext = await renderStorageContext();

    expect(storageContext.current.decks).toEqual([]);
  });

  describe("#createDeck", () => {
    const deck = DeckFactory();

    beforeEach(() => {
      jest.spyOn(Storage, "setItemAsync").mockResolvedValueOnce();
    });

    it("surfaces errors on unsuccessful response", async () => {
      jest.spyOn(DeckRepository, "create").mockResolvedValueOnce({
        ok: false,
        message: "test error",
      });

      const storageContext = await renderStorageContext();

      try {
        await act(async () => {
          await storageContext.current.createDeck({ name: deck.name });
        });
      } catch (e: any) {
        expect(e.message).toEqual("test error");
      }

      expect(DeckRepository.create).toHaveBeenCalledTimes(1);
      expect(DeckRepository.create).toHaveBeenCalledWith({
        name: deck.name,
      });

      expect(Storage.setItemAsync).not.toHaveBeenCalled();

      // Assert context state has not updated
      expect(storageContext.current.decks).toEqual([]);
    });

    it("creates deck using the repository and updates context", async () => {
      jest
        .spyOn(DeckRepository, "create")
        .mockResolvedValueOnce({ ok: true, payload: deck });

      const storageContext = await renderStorageContext();

      expect(storageContext.current.decks).toEqual([]);

      await act(async () => {
        await storageContext.current.createDeck({ name: deck.name });
      });

      expect(Storage.setItemAsync).toHaveBeenCalledWith(
        "selected_deck_idx",
        "0",
      );
      expect(DeckRepository.create).toHaveBeenCalledTimes(1);
      expect(DeckRepository.create).toHaveBeenCalledWith({
        name: deck.name,
      });

      // Assert context state updated
      expect(storageContext.current.decks).toEqual([deck]);
    });
  });

  describe("with decks preloaded", () => {
    const deck1 = DeckFactory({
      id: 1,
      name: "Default",
    });

    const deck2 = DeckFactory({
      id: 2,
      name: "Second Deck",
    });

    const decks = [deck1, deck2];

    beforeEach(() => {
      jest
        .spyOn(DeckRepository, "index")
        .mockResolvedValueOnce({ ok: true, payload: decks });
    });

    describe("#saveSelectedDeckIdx", () => {
      beforeEach(() => {
        jest.spyOn(CardRepository, "index").mockReturnValue({
          ok: true,
          payload: [],
        });
      });

      it("defaults selectedDeckIdx to 0 if none is stored", async () => {
        (Storage.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

        const storageContext = await renderStorageContext();

        expect(storageContext.current.selectedDeck).toEqual(decks[0]);
      });

      it("saves current deck idx to SecureStore and updates context", async () => {
        jest.spyOn(Storage, "setItemAsync").mockResolvedValueOnce();

        const storageContext = await renderStorageContext();

        expect(storageContext.current.selectedDeck).toEqual(decks[0]);

        await act(async () => {
          await storageContext.current.saveSelectedDeckIdx(1);
        });

        expect(Storage.setItemAsync).toHaveBeenCalledTimes(1);
        expect(Storage.setItemAsync).toHaveBeenCalledWith(
          "selected_deck_idx",
          "1",
        );

        // Assert context state updated
        expect(storageContext.current.selectedDeck).toEqual(decks[1]);
      });
    });

    describe("#fetchDeck", () => {
      it("returns deck if found", async () => {
        const storageContext = await renderStorageContext();

        expect(storageContext.current.fetchDeck(decks[0].id)).toEqual(decks[0]);
      });

      it("returns null if not", async () => {
        const storageContext = await renderStorageContext();

        expect(storageContext.current.fetchDeck(-1)).toBeNull();
      });
    });

    describe("#updateDeck", () => {
      it("surfaces errors from the repository", async () => {
        jest.spyOn(DeckRepository, "update").mockResolvedValueOnce({
          ok: false,
          changes: 0,
          message: "test error",
        });

        const storageContext = await renderStorageContext();

        try {
          await act(async () => {
            await storageContext.current.updateDeck(-1, {
              name: "Updated",
            });
          });
        } catch (e: any) {
          expect(e.message).toEqual("test error");
        }

        expect(DeckRepository.update).toHaveBeenCalledTimes(1);
        expect(DeckRepository.update).toHaveBeenCalledWith(-1, {
          name: "Updated",
        });

        // Assert context state not updated
        expect(storageContext.current.decks).toEqual(decks);
      });

      it("permits a partial update of just name", async () => {
        jest.spyOn(DeckRepository, "update").mockResolvedValueOnce({
          ok: true,
          changes: 1,
        });

        const storageContext = await renderStorageContext();

        await act(async () => {
          await storageContext.current.updateDeck(decks[1].id, {
            name: "Updated",
          });
        });

        const expectedDeck = DeckFactory({
          name: "Updated",
          id: decks[1].id,
        });

        expect(DeckRepository.update).toHaveBeenCalledTimes(1);
        expect(DeckRepository.update).toHaveBeenCalledWith(decks[1].id, {
          name: "Updated",
        });

        // Assert context state updated
        expect(storageContext.current.decks).toEqual([decks[0], expectedDeck]);
      });
    });

    describe("#destroyDeck", () => {
      it("surfaces errors from the repository", async () => {
        jest.spyOn(DeckRepository, "delete").mockResolvedValueOnce({
          ok: false,
          changes: 0,
          message: "test error",
        });

        const storageContext = await renderStorageContext();

        try {
          await act(async () => {
            await storageContext.current.destroyDeck(decks[1].id);
          });
        } catch (e: any) {
          expect(e.message).toEqual("test error");
        }

        expect(DeckRepository.delete).toHaveBeenCalledTimes(1);
        expect(DeckRepository.delete).toHaveBeenCalledWith(decks[1].id);

        // Assert context state not updated
        expect(storageContext.current.decks).toEqual(decks);
      });

      it("saves new deck list to SecureStore and updates context", async () => {
        jest.spyOn(DeckRepository, "delete").mockResolvedValueOnce({
          ok: true,
          changes: 1,
        });

        const storageContext = await renderStorageContext();

        await act(async () => {
          await storageContext.current.destroyDeck(decks[1].id);
        });

        expect(DeckRepository.delete).toHaveBeenCalledTimes(1);
        expect(DeckRepository.delete).toHaveBeenCalledWith(decks[1].id);

        // Assert context state updated
        expect(storageContext.current.decks).toEqual([decks[0]]);
      });
    });
  });

  describe("#createPlayer", () => {
    const player = PlayerFactory({ name: "Alice" });

    it("surfaces errors on unsuccessful response", async () => {
      jest.spyOn(PlayerRepository, "create").mockResolvedValueOnce({
        ok: false,
        message: "test error",
      });

      const storageContext = await renderStorageContext();

      try {
        await act(async () => {
          await storageContext.current.createPlayer({ name: player.name });
        });
      } catch (e: any) {
        expect(e.message).toEqual("test error");
      }

      expect(PlayerRepository.create).toHaveBeenCalledTimes(1);
      expect(PlayerRepository.create).toHaveBeenCalledWith({
        name: player.name,
      });

      // Assert context state has not updated
      expect(storageContext.current.players).toEqual([]);
    });

    it("creates player using the repository and updates context", async () => {
      jest
        .spyOn(PlayerRepository, "create")
        .mockResolvedValueOnce({ ok: true, payload: player });

      const storageContext = await renderStorageContext();

      expect(storageContext.current.players).toEqual([]);

      await act(async () => {
        await storageContext.current.createPlayer({ name: player.name });
      });

      expect(PlayerRepository.create).toHaveBeenCalledTimes(1);
      expect(PlayerRepository.create).toHaveBeenCalledWith({
        name: player.name,
      });

      // Assert context state updated
      expect(storageContext.current.players).toEqual([player]);
    });
  });

  describe("#deletePlayer", () => {
    const player = PlayerFactory({ name: "Alice" });

    beforeEach(() => {
      jest
        .spyOn(PlayerRepository, "index")
        .mockResolvedValueOnce({ ok: true, payload: [player] });
    });

    it("surfaces errors on unsuccessful response", async () => {
      jest.spyOn(PlayerRepository, "delete").mockResolvedValueOnce({
        ok: true,
        changes: 0,
        message: "test error",
      });

      const storageContext = await renderStorageContext();

      try {
        await act(async () => {
          await storageContext.current.deletePlayer(player.id);
        });
      } catch (e: any) {
        expect(e.message).toEqual("test error");
      }

      expect(PlayerRepository.delete).toHaveBeenCalledTimes(1);
      expect(PlayerRepository.delete).toHaveBeenCalledWith(player.id);

      // Assert context state has not updated
      expect(storageContext.current.players).toEqual([player]);
    });

    it("deletes player using the repository and updates context", async () => {
      jest
        .spyOn(PlayerRepository, "delete")
        .mockResolvedValueOnce({ ok: true, changes: 1 });

      const storageContext = await renderStorageContext();

      expect(storageContext.current.players).toEqual([player]);

      await act(async () => {
        await storageContext.current.deletePlayer(player.id);
      });

      expect(PlayerRepository.delete).toHaveBeenCalledTimes(1);
      expect(PlayerRepository.delete).toHaveBeenCalledWith(player.id);

      expect(storageContext.current.players).toEqual([]);
    });
  });
});
