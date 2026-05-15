import {
  loadResourceImpl,
  saveResourceImpl,
  StorageContext,
  StorageProvider,
} from "@/src/context/StorageContext";
import { Deck } from "@/src/models/Deck";
import { PlayerRepository } from "@/src/repositories/PlayerRepository";
import { TDeckData } from "@/src/types";
import { renderHook, waitFor } from "@testing-library/react-native";
import * as SecureStore from "expo-secure-store";
import { act, useContext } from "react";

jest.mock("expo-sqlite", () => ({
  useSQLiteContext: jest.fn(),
}));

const mockStore: Record<string, string> = {};
const mockGetItemAsync = jest.fn(
  async (key: string): Promise<any> =>
    Object.prototype.hasOwnProperty.call(mockStore, key)
      ? mockStore[key]
      : null,
);
const mockSetItemAsync = jest.fn(async (key: string, value: string) => {
  mockStore[key] = value;
});

const storageKey = "players";
const fallbackValue = [] as any;

describe("StorageContext", () => {
  beforeEach(() => {
    jest
      .spyOn(SecureStore, "getItemAsync")
      .mockImplementation(mockGetItemAsync);

    jest
      .spyOn(SecureStore, "setItemAsync")
      .mockImplementation(mockSetItemAsync);

    // Reset your mock store
    Object.keys(mockStore).forEach((k) => delete mockStore[k]);
  });

  describe("#loadResourceImpl", () => {
    it("defaults to fallback if the data load fails", async () => {
      mockGetItemAsync.mockRejectedValueOnce(new Error("test error"));

      const result = await loadResourceImpl(storageKey, fallbackValue);

      expect(result).toEqual(fallbackValue);
    });

    it("defaults to fallback if no data found in storage", async () => {
      mockGetItemAsync.mockResolvedValueOnce(null);

      const result = await loadResourceImpl(storageKey, fallbackValue);

      expect(result).toEqual(fallbackValue);
    });

    it("returns parsed data when found", async () => {
      mockGetItemAsync.mockResolvedValueOnce(JSON.stringify(["Sally"]));

      const result = await loadResourceImpl(storageKey, fallbackValue);

      expect(result).toEqual(["Sally"]);
    });
  });

  describe("#saveResourceImpl", () => {
    it("throws an error if data save fails", async () => {
      mockSetItemAsync.mockRejectedValueOnce(new Error("test error"));

      await saveResourceImpl("players", ["Sally"]);

      expect(mockSetItemAsync).toHaveBeenCalledWith(
        "players",
        JSON.stringify(["Sally"]),
      );
    });

    it("successfully commits new user list to storage", async () => {
      mockSetItemAsync.mockResolvedValueOnce();

      await saveResourceImpl("players", ["Sally"]);

      expect(mockSetItemAsync).toHaveBeenCalledWith(
        "players",
        JSON.stringify(["Sally"]),
      );
    });
  });

  describe("StorageProvider", () => {
    const decks = [
      { id: "1", name: "Default", cards: ["Test card"] },
      { id: "2", name: "Second Deck", cards: ["Test 2"] },
    ] as TDeckData[];

    beforeEach(() => {
      mockStore["decks"] = JSON.stringify(decks);

      mockSetItemAsync.mockResolvedValueOnce();
    });

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

    it("initialises repositories", async () => {
      jest.spyOn(PlayerRepository, "initialise");

      await renderStorageContext();

      expect(PlayerRepository.initialise).toHaveBeenCalledTimes(1);
    });

    describe("#saveSelectedDeckIdx", () => {
      it("saves current deck idx to SecureStore and updates context", async () => {
        const storageContext = await renderStorageContext();

        expect(storageContext.current.selectedDeck).toEqual(decks[0]);

        await act(async () => {
          await storageContext.current.saveSelectedDeckIdx(1);
        });

        expect(mockSetItemAsync).toHaveBeenCalledTimes(1);
        expect(mockSetItemAsync).toHaveBeenCalledWith("selected_deck_idx", "1");

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

        expect(storageContext.current.fetchDeck("FAKE ID")).toBeNull();
      });
    });

    describe("#createDeck", () => {
      it("creates a blank deck & adds it to context", async () => {
        let newDeck;
        const storageContext = await renderStorageContext();

        await act(async () => {
          newDeck = await storageContext.current.createDeck();
        });

        expect(mockSetItemAsync).toHaveBeenCalledTimes(1);
        expect(mockSetItemAsync).toHaveBeenCalledWith(
          "decks",
          JSON.stringify([...decks, newDeck]),
        );

        // Assert context state updated
        expect(storageContext.current.decks).toEqual([...decks, newDeck]);

        expect(newDeck!.name).toEqual("");
        expect(newDeck!.cards).toEqual([]);
      });

      it("instantiates with a given name if provided", async () => {
        let newDeck;
        const storageContext = await renderStorageContext();

        await act(async () => {
          newDeck = await storageContext.current.createDeck("My Deck <3");
        });

        expect(newDeck!.name).toEqual("My Deck <3");
        expect(newDeck!.cards).toEqual([]);
      });
    });

    describe("#updateDeck", () => {
      it("throws an error if deck is not found", async () => {
        const storageContext = await renderStorageContext();

        try {
          await act(async () => {
            await storageContext.current.updateDeck("INVALID_ID", {
              cards: ["Updated"],
            });
          });
        } catch (e: any) {
          expect(e.message).toEqual("Deck INVALID_ID not found");
        }

        expect(mockSetItemAsync).toHaveBeenCalledTimes(0);

        // Assert context state not updated
        expect(storageContext.current.decks).toEqual(decks);
      });

      it("saves complete deck to SecureStore and updates context", async () => {
        const storageContext = await renderStorageContext();

        const updatedDeck = new Deck(
          decks[0].name,
          ["Test card updated"],
          decks[0].id,
        );

        await act(async () => {
          await storageContext.current.updateDeck(decks[0].id, updatedDeck);
        });

        expect(mockSetItemAsync).toHaveBeenCalledTimes(1);
        expect(mockSetItemAsync).toHaveBeenCalledWith(
          "decks",
          JSON.stringify([updatedDeck, decks[1]]),
        );

        // Assert context state updated
        expect(storageContext.current.decks).toEqual([updatedDeck, decks[1]]);
      });

      it("permits a partial update of just name", async () => {
        const storageContext = await renderStorageContext();

        await act(async () => {
          await storageContext.current.updateDeck(decks[1].id, {
            name: "Updated deck",
          });
        });

        const expectedDeck = new Deck(
          "Updated deck",
          decks[1].cards,
          decks[1].id,
        );

        expect(mockSetItemAsync).toHaveBeenCalledTimes(1);
        expect(mockSetItemAsync).toHaveBeenCalledWith(
          "decks",
          JSON.stringify([decks[0], expectedDeck]),
        );

        // Assert context state updated
        expect(storageContext.current.decks).toEqual([decks[0], expectedDeck]);
      });

      it("permits a partial update of just cards", async () => {
        const storageContext = await renderStorageContext();

        await act(async () => {
          await storageContext.current.updateDeck(decks[0].id, {
            cards: ["Test card updated"],
          });
        });

        const expectedDeck = new Deck(
          decks[0].name,
          ["Test card updated"],
          decks[0].id,
        );

        expect(mockSetItemAsync).toHaveBeenCalledTimes(1);
        expect(mockSetItemAsync).toHaveBeenCalledWith(
          "decks",
          JSON.stringify([expectedDeck, decks[1]]),
        );

        // Assert context state updated
        expect(storageContext.current.decks).toEqual([expectedDeck, decks[1]]);
      });

      it("ignores id in update", async () => {
        const storageContext = await renderStorageContext();

        await act(async () => {
          await storageContext.current.updateDeck(decks[0].id, {
            id: "INVALID ID",
          });
        });

        const expectedDeck = new Deck(
          decks[0].name,
          decks[0].cards,
          decks[0].id,
        );

        expect(mockSetItemAsync).toHaveBeenCalledTimes(1);
        expect(mockSetItemAsync).toHaveBeenCalledWith(
          "decks",
          JSON.stringify([expectedDeck, decks[1]]),
        );

        // Assert context state updated
        expect(storageContext.current.decks).toEqual([expectedDeck, decks[1]]);
      });
    });

    describe("#destroyDeck", () => {
      it("throws an error if deck is not found", async () => {
        const storageContext = await renderStorageContext();

        try {
          await act(async () => {
            await storageContext.current.destroyDeck("INVALID_ID");
          });
        } catch (e: any) {
          expect(e.message).toEqual("Deck INVALID_ID not found");
        }

        expect(mockSetItemAsync).toHaveBeenCalledTimes(0);

        // Assert context state not updated
        expect(storageContext.current.decks).toEqual(decks);
      });

      it("saves new deck list to SecureStore and updates context", async () => {
        const storageContext = await renderStorageContext();

        await act(async () => {
          await storageContext.current.destroyDeck(decks[1].id);
        });

        expect(mockSetItemAsync).toHaveBeenCalledTimes(1);
        expect(mockSetItemAsync).toHaveBeenCalledWith(
          "decks",
          JSON.stringify([decks[0]]),
        );

        // Assert context state updated
        expect(storageContext.current.decks).toEqual([decks[0]]);
      });
    });

    describe("#savePlayers", () => {
      it("saves players to SecureStore and updates context", async () => {
        const storageContext = await renderStorageContext();

        const newPlayers = ["Sally", "Alice"];

        await act(async () => {
          await storageContext.current.savePlayers(newPlayers);
        });

        expect(mockSetItemAsync).toHaveBeenCalledTimes(1);
        expect(mockSetItemAsync).toHaveBeenCalledWith(
          "players",
          JSON.stringify(newPlayers),
        );

        // Assert context state updated
        expect(storageContext.current.players).toEqual(newPlayers);
      });
    });
  });
});
