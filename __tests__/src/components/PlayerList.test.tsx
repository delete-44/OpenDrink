import { PlayerFactory } from "@/factories/models/PlayerFactory";
import PlayerList from "@/src/components/PlayerList";
import { StorageContext } from "@/src/context/StorageContext";
import { BaseMockStorageContext } from "@/test-utils";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React, { act } from "react";

describe("PlayerList", () => {
  const mockCreatePlayer = jest.fn();
  const mockDeletePlayer = jest.fn();

  it("renders a loading state", () => {
    const mockStorageContext = {
      ...BaseMockStorageContext,
      createPlayer: mockCreatePlayer,
      deletePlayer: mockDeletePlayer,
      players: [],
      isLoading: true,
    };

    render(
      <StorageContext.Provider value={mockStorageContext}>
        <PlayerList />
      </StorageContext.Provider>,
    );

    expect(screen.queryByText("Add Players here!")).toBeNull();
    expect(screen.getByLabelText("Loading Players")).toBeVisible();
  });

  describe("with no players initialised", () => {
    const mockStorageContext = {
      ...BaseMockStorageContext,
      createPlayer: mockCreatePlayer,
      deletePlayer: mockDeletePlayer,
      players: [],
      isLoading: false,
    };

    it("renders an empty state when no players provided", () => {
      render(
        <StorageContext.Provider value={mockStorageContext}>
          <PlayerList />
        </StorageContext.Provider>,
      );

      expect(screen.getByText("Add Players here!")).toBeVisible();
      expect(screen.queryByLabelText("Loading Players")).toBeNull();
    });

    it("surfaces errors from StorageContext on create", async () => {
      mockCreatePlayer.mockRejectedValueOnce(new Error("test error"));

      render(
        <StorageContext.Provider value={mockStorageContext}>
          <PlayerList />
        </StorageContext.Provider>,
      );

      let errorMessage = screen.queryByText("test error");
      expect(errorMessage).toBeNull();

      const input = screen.getByLabelText("Name");
      fireEvent.changeText(input, "Alice");

      const addButton = screen.getByRole("button", { name: "Add Player" });

      fireEvent.press(addButton);

      expect(mockCreatePlayer).toHaveBeenCalledWith({ name: "Alice" });
      expect(input).toHaveProp("value", "Alice");

      await waitFor(() => {
        expect(screen.getByText("test error")).toBeVisible();
      });
    });

    it("clears error message on new input", async () => {
      mockCreatePlayer.mockRejectedValueOnce(new Error("test error"));

      render(
        <StorageContext.Provider value={mockStorageContext}>
          <PlayerList />
        </StorageContext.Provider>,
      );

      expect(screen.queryByText("test error")).toBeNull();

      const input = screen.getByLabelText("Name");
      const addButton = screen.getByRole("button", { name: "Add Player" });
      fireEvent.press(addButton);

      expect(mockCreatePlayer).toHaveBeenCalledWith({ name: "" });
      expect(input).toHaveProp("value", "");

      await waitFor(() => {
        expect(screen.getByText("test error")).toBeVisible();
      });

      await act(() => fireEvent.changeText(input, "Alice"));

      expect(screen.queryByText("test error")).toBeNull();
    });

    it("successfully creates players", async () => {
      render(
        <StorageContext.Provider value={mockStorageContext}>
          <PlayerList />
        </StorageContext.Provider>,
      );

      const input = screen.getByLabelText("Name");
      fireEvent.changeText(input, "Alice");

      const addButton = screen.getByRole("button", { name: "Add Player" });
      fireEvent.press(addButton);

      expect(mockCreatePlayer).toHaveBeenCalledWith({ name: "Alice" });
      await waitFor(() => {
        expect(input).toHaveProp("value", "");
      });
    });

    it("allows user to submit text using their native keyboard", async () => {
      render(
        <StorageContext.Provider value={mockStorageContext}>
          <PlayerList />
        </StorageContext.Provider>,
      );

      const input = screen.getByLabelText("Name");
      fireEvent.changeText(input, "Alice");

      fireEvent(screen.getByLabelText("Name"), "submitEditing");

      expect(mockCreatePlayer).toHaveBeenCalledWith({ name: "Alice" });
      await waitFor(() => {
        expect(input).toHaveProp("value", "");
      });
    });
  });

  describe("with existing players", () => {
    const player1 = PlayerFactory({ id: 1, name: "Alice" });
    const player2 = PlayerFactory({ id: 2, name: "Rincewind" });

    const mockStorageContext = {
      ...BaseMockStorageContext,
      createPlayer: mockCreatePlayer,
      deletePlayer: mockDeletePlayer,
      players: [player1, player2],
      isLoading: false,
    };

    it("renders a list of players from storage", () => {
      render(
        <StorageContext.Provider value={mockStorageContext}>
          <PlayerList />
        </StorageContext.Provider>,
      );

      expect(screen.getByText(player1.name)).toBeVisible();
      expect(screen.getByText(player2.name)).toBeVisible();
    });

    it("surfaces errors from StorageContext on delete", async () => {
      mockDeletePlayer.mockRejectedValueOnce(new Error("test error"));

      render(
        <StorageContext.Provider value={mockStorageContext}>
          <PlayerList />
        </StorageContext.Provider>,
      );

      let errorMessage = screen.queryByText("test error");
      expect(errorMessage).toBeNull();

      const removePlayerButton = screen.getByRole("button", {
        name: `Remove ${player1.name}`,
      });

      fireEvent.press(removePlayerButton);

      expect(mockDeletePlayer).toHaveBeenCalledWith(player1.id);

      await waitFor(() => {
        expect(screen.getByText("test error")).toBeVisible();
      });
    });

    it("allows user to remove players", () => {
      mockDeletePlayer.mockResolvedValueOnce(undefined);

      render(
        <StorageContext.Provider value={mockStorageContext}>
          <PlayerList />
        </StorageContext.Provider>,
      );

      const removePlayerButton = screen.getByRole("button", {
        name: `Remove ${player1.name}`,
      });

      fireEvent.press(removePlayerButton);

      expect(mockDeletePlayer).toHaveBeenCalledWith(player1.id);
    });
  });
});
