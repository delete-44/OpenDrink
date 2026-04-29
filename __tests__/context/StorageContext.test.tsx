import {
  loadResourceImpl,
  saveResourceImpl,
  StorageContext,
  StorageProvider,
} from "@/context/StorageContext";
import { TDeck } from "@/src/types";
import { renderHook, waitFor } from "@testing-library/react-native";
import * as SecureStore from "expo-secure-store";
import { act, useContext } from "react";

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

jest.spyOn(SecureStore, "getItemAsync").mockImplementation(mockGetItemAsync);
jest.spyOn(SecureStore, "setItemAsync").mockImplementation(mockSetItemAsync);

const storageKey = "players";
const fallbackValue = [] as any;

describe("StorageContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    beforeEach(() => {
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

    describe("#saveCurrentDeckIndex", () => {
      it("saves current deck idx to SecureStore and updates context", async () => {
        const decks = [
          { name: "Default", cards: ["Test card"] },
          { name: "Second Deck", cards: ["Test 2"] },
        ] as TDeck[];

        mockStore["decks"] = JSON.stringify(decks);

        const storageContext = await renderStorageContext();

        const newIdx = 1;

        await act(async () => {
          await storageContext.current.saveCurrentDeckIndex(newIdx);
        });

        expect(mockSetItemAsync).toHaveBeenCalledTimes(1);
        expect(mockSetItemAsync).toHaveBeenCalledWith(
          "current_deck_idx",
          JSON.stringify(newIdx),
        );

        // Assert context state updated
        expect(storageContext.current.currentDeckIndex).toEqual(newIdx);
      });
    });

    describe("#saveDecks", () => {
      it("saves decks to SecureStore and updates context", async () => {
        const storageContext = await renderStorageContext();

        const newDecks = [{ name: "Default", cards: ["Test card"] }] as TDeck[];

        await act(async () => {
          await storageContext.current.saveDecks(newDecks);
        });

        expect(mockSetItemAsync).toHaveBeenCalledTimes(1);
        expect(mockSetItemAsync).toHaveBeenCalledWith(
          "decks",
          JSON.stringify(newDecks),
        );

        // Assert context state updated
        expect(storageContext.current.decks).toEqual(newDecks);
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
