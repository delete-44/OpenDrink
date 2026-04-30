import PlayerList from "@/components/PlayerList";
import { StorageContext } from "@/context/StorageContext";
import { NonEmptyArray } from "@/src/types";
import { fireEvent, render, screen } from "@testing-library/react-native";

describe("PlayerList", () => {
  const mockSavePlayers = jest.fn();
  const mockValue = {
    players: [],
    savePlayers: mockSavePlayers,
    isLoading: false,
    currentDeck: {
      name: "Test",
      cards: ["123"] as NonEmptyArray<string>,
    },
    currentDeckIndex: 0,
    saveCurrentDeckIndex: jest.fn(),
    decks: [],
    saveDecks: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders an empty state when no players provided", () => {
    render(
      <StorageContext.Provider value={mockValue}>
        <PlayerList />
      </StorageContext.Provider>,
    );

    const noPlayersMessage = screen.getByText("Add players here!");
    expect(noPlayersMessage).toBeVisible();
  });

  it("prevents user adding empty names", () => {
    render(
      <StorageContext.Provider value={mockValue}>
        <PlayerList />
      </StorageContext.Provider>,
    );

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
    render(
      <StorageContext.Provider value={mockValue}>
        <PlayerList />
      </StorageContext.Provider>,
    );

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
    render(
      <StorageContext.Provider value={mockValue}>
        <PlayerList />
      </StorageContext.Provider>,
    );

    const input = screen.getByLabelText("Name");
    fireEvent.changeText(input, " Alice  ");

    const addButton = screen.getByRole("button", { name: "Add Player" });
    fireEvent.press(addButton);

    expect(mockSavePlayers).toHaveBeenCalledWith(["Alice"]);
    expect(input).toHaveProp("value", "");
  });

  it("renders a loading state", () => {
    const mockValue = {
      players: [],
      savePlayers: jest.fn(),
      isLoading: true,
      currentDeck: {
        name: "Test",
        cards: ["123"] as NonEmptyArray<string>,
      },
      currentDeckIndex: 0,
      saveCurrentDeckIndex: jest.fn(),
      decks: [],
      saveDecks: jest.fn(),
    };

    render(
      <StorageContext.Provider value={mockValue}>
        <PlayerList />
      </StorageContext.Provider>,
    );

    expect(screen.queryByText("Add players here!")).toBeNull();
    expect(screen.getByLabelText("Loading players")).toBeVisible();
  });

  describe("with existing players", () => {
    const mockValue = {
      players: ["Alice", "Rincewind"],
      savePlayers: jest.fn(),
      isLoading: false,
      currentDeck: {
        name: "Test",
        cards: ["123"] as NonEmptyArray<string>,
      },
      currentDeckIndex: 0,
      saveCurrentDeckIndex: jest.fn(),
      decks: [],
      saveDecks: jest.fn(),
    };

    it("renders a list of players from storage", () => {
      render(
        <StorageContext.Provider value={mockValue}>
          <PlayerList />
        </StorageContext.Provider>,
      );

      expect(screen.getByText("Alice")).toBeVisible();
      expect(screen.getByText("Rincewind")).toBeVisible();
    });

    it("prevents duplicate players from being added", () => {
      render(
        <StorageContext.Provider value={mockValue}>
          <PlayerList />
        </StorageContext.Provider>,
      );

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
  });
});
