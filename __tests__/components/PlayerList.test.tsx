import PlayerList from "@/components/PlayerList";
import { StorageContext } from "@/contexts/StorageContext";
import { fireEvent, render, screen } from "@testing-library/react-native";

describe("PlayerList", () => {
  const mockSavePlayers = jest.fn();
  const mockValue = {
    players: [],
    savePlayers: mockSavePlayers,
    isLoading: false,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  // TODO
  it("renders an empty state when no players provided", () => {});

  it("prevents user adding empty names", () => {
    render(
      <StorageContext.Provider value={mockValue}>
        <PlayerList />
      </StorageContext.Provider>,
    );

    const input = screen.getByLabelText("Name");
    const addButton = screen.getByRole("button", { name: "Add Player" });
    fireEvent.press(addButton);

    expect(mockSavePlayers).not.toHaveBeenCalled();
    expect(input).toHaveProp("value", "");
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

  // TODO
  it("renders a loading state", () => {});

  describe("with existing players", () => {
    const mockValue = {
      players: ["Alice", "Rincewind"],
      savePlayers: jest.fn(),
      isLoading: false,
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

      const input = screen.getByLabelText("Name");
      fireEvent.changeText(input, "Alice");

      const addButton = screen.getByRole("button", { name: "Add Player" });
      fireEvent.press(addButton);

      expect(mockSavePlayers).not.toHaveBeenCalled();
      expect(input).toHaveProp("value", "Alice");

      // TODO: Assert error message is shown
    });
  });
});
