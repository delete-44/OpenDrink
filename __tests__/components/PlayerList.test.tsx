import PlayerList from "@/components/PlayerList";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

describe("PlayerList", () => {
  const mockSavePlayers = jest.fn();

  it("renders a loading state", () => {
    jest.spyOn(React, "useContext").mockReturnValueOnce({
      players: [],
      savePlayers: mockSavePlayers,
      isLoading: true,
    });

    render(<PlayerList />);

    expect(screen.queryByText("Add Players here!")).toBeNull();
    expect(screen.getByLabelText("Loading Players")).toBeVisible();
  });

  describe("with no players initialised", () => {
    beforeEach(() => {
      jest.spyOn(React, "useContext").mockReturnValue({
        players: [],
        savePlayers: mockSavePlayers,
        isLoading: false,
      });
    });

    it("renders an empty state when no players provided", () => {
      render(<PlayerList />);

      expect(screen.getByText("Add Players here!")).toBeVisible();
      expect(screen.queryByLabelText("Loading Players")).toBeNull();
    });

    it("prevents user adding empty names", () => {
      render(<PlayerList />);

      let errorMessage = screen.queryByText("Player name cannot be empty");
      expect(errorMessage).toBeNull();

      const input = screen.getByLabelText("Name");
      const addButton = screen.getByRole("button", { name: "Add Player" });
      fireEvent.press(addButton);

      expect(mockSavePlayers).not.toHaveBeenCalled();
      expect(input).toHaveProp("value", "");

      errorMessage = screen.getByText("Player name cannot be empty");
      expect(errorMessage).toBeVisible();
    });

    it("clears error message on new input", () => {
      render(<PlayerList />);

      let errorMessage = screen.queryByText("Player name cannot be empty");
      expect(errorMessage).toBeNull();

      const input = screen.getByLabelText("Name");
      const addButton = screen.getByRole("button", { name: "Add Player" });
      fireEvent.press(addButton);

      expect(mockSavePlayers).not.toHaveBeenCalled();
      expect(input).toHaveProp("value", "");

      errorMessage = screen.getByText("Player name cannot be empty");
      expect(errorMessage).toBeVisible();

      fireEvent.changeText(input, "Alice");

      errorMessage = screen.queryByText("Player name cannot be empty");
      expect(errorMessage).toBeNull();
    });

    it("trims whitespace from player names", () => {
      render(<PlayerList />);

      const input = screen.getByLabelText("Name");
      fireEvent.changeText(input, " Alice  ");

      const addButton = screen.getByRole("button", { name: "Add Player" });
      fireEvent.press(addButton);

      expect(mockSavePlayers).toHaveBeenCalledWith(["Alice"]);
      expect(input).toHaveProp("value", "");
    });
  });

  describe("with existing players", () => {
    beforeEach(() => {
      jest.spyOn(React, "useContext").mockReturnValue({
        players: ["Alice", "Rincewind"],
        savePlayers: mockSavePlayers,
        isLoading: false,
      });
    });

    it("renders a list of players from storage", () => {
      render(<PlayerList />);

      expect(screen.getByText("Alice")).toBeVisible();
      expect(screen.getByText("Rincewind")).toBeVisible();
    });

    it("prevents duplicate players from being added", () => {
      render(<PlayerList />);

      let errorMessage = screen.queryByText("Player already exists");
      expect(errorMessage).toBeNull();

      const input = screen.getByLabelText("Name");
      fireEvent.changeText(input, "Alice");

      const addButton = screen.getByRole("button", { name: "Add Player" });
      fireEvent.press(addButton);

      expect(mockSavePlayers).not.toHaveBeenCalled();
      expect(input).toHaveProp("value", "Alice");

      errorMessage = screen.getByText("Player already exists");
      expect(errorMessage).toBeVisible();
    });

    it("allows user to remove players", () => {
      render(<PlayerList />);

      const removePlayerButton = screen.getByRole("button", {
        name: "Remove Rincewind",
      });

      fireEvent.press(removePlayerButton);
      expect(mockSavePlayers).toHaveBeenCalledWith(["Alice"]);
    });
  });
});
