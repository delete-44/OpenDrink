import { DeckFactory } from "@/factories/models/DeckFactory";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { router } from "expo-router";
import React, { act } from "react";
import { DeviceEventEmitter } from "react-native";
import Index from "../../app/index";

jest.mock("expo-router", () => ({
  router: {
    navigate: jest.fn(),
  },
}));

describe("Index", () => {
  it("shows loading spinner whilst fetching data", () => {
    const testDeck = DeckFactory();
    jest.spyOn(React, "useContext").mockReturnValue({
      selectedDeck: testDeck,
      decks: [testDeck],
      players: ["Sally"],
      isLoading: true,
    });

    render(<Index />);

    expect(screen.queryByText(testDeck.name)).toBeNull();
    expect(screen.getByLabelText("Loading Decks")).toBeVisible();
  });

  describe("once loaded", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    describe("when no deck is available", () => {
      beforeEach(() => {
        jest.spyOn(React, "useContext").mockReturnValue({
          selectedDeck: null,
          decks: [],
          players: ["Sally"],
          isLoading: false,
        });
      });

      it("renders DeckSelectorEmptyState", () => {
        render(<Index />);

        expect(screen.getByText("Add a Deck to get started:")).toBeVisible();
        expect(screen.queryByRole("button", { name: "Edit Deck" })).toBeNull();
      });

      it("resets the warning timeout on repeated clicks so it lasts 3000ms after the last click", async () => {
        render(<Index />);

        const getStartedButton = screen.getByRole("button", {
          name: "Get Started!",
        });

        fireEvent.press(getStartedButton); // t0
        expect(screen.getByText("No Deck selected")).toBeVisible();

        act(() => jest.advanceTimersByTime(1000)); // t0 + 1000ms
        expect(screen.getByText("No Deck selected")).toBeVisible();

        fireEvent.press(getStartedButton); // t1 = t0 + 1000ms (restarts timer)

        act(() => jest.advanceTimersByTime(2999)); // t1 + 2999ms (still visible)
        expect(screen.getByText("No Deck selected")).toBeVisible();

        act(() => jest.advanceTimersByTime(1)); // t1 + 3000ms => should disappear

        expect(screen.queryByText("No Deck selected")).toBeNull();
      });

      it("shows a warning if user tries to start the game", async () => {
        render(<Index />);

        const getStartedButton = screen.getByRole("button", {
          name: "Get Started!",
        });

        fireEvent.press(getStartedButton);

        expect(screen.getByText("No Deck selected")).toBeVisible();
        expect(router.navigate).not.toHaveBeenCalled();

        act(() => jest.runAllTimers());

        expect(screen.queryByText("No Deck selected")).toBeNull();
      });
    });

    describe("when deck has no cards", () => {
      beforeEach(() => {
        const testDeck = DeckFactory({ cards: [] });
        jest.spyOn(React, "useContext").mockReturnValue({
          selectedDeck: testDeck,
          decks: [testDeck],
          players: ["Sally"],
          isLoading: false,
        });
      });

      it("shows full deck selector", () => {
        render(<Index />);

        expect(screen.queryByText("Add a Deck to get started:")).toBeNull();
        expect(screen.getByRole("button", { name: "Edit Deck" })).toBeVisible();
      });

      it("shows a warning if user tries to start the game", async () => {
        render(<Index />);

        const getStartedButton = screen.getByRole("button", {
          name: "Get Started!",
        });

        fireEvent.press(getStartedButton);

        expect(screen.getByText("Selected Deck has no Cards")).toBeVisible();
        expect(router.navigate).not.toHaveBeenCalled();

        act(() => jest.runAllTimers());

        expect(screen.queryByText("Selected Deck has no Cards")).toBeNull();
      });
    });

    describe("when missing players", () => {
      beforeEach(() => {
        const testDeck = DeckFactory();
        jest.spyOn(React, "useContext").mockReturnValue({
          selectedDeck: testDeck,
          decks: [testDeck],
          players: [],
          isLoading: false,
        });
      });

      it("shows a warning if user tries to start the game", async () => {
        render(<Index />);

        const getStartedButton = screen.getByRole("button", {
          name: "Get Started!",
        });

        fireEvent.press(getStartedButton);

        expect(screen.getByText("No Players added")).toBeVisible();
        expect(router.navigate).not.toHaveBeenCalled();

        act(() => jest.runAllTimers());

        expect(screen.queryByText("No Players added")).toBeNull();
      });
    });

    describe("with a valid game state", () => {
      const testDeck = DeckFactory();

      beforeEach(() => {
        jest.spyOn(React, "useContext").mockReturnValue({
          selectedDeck: testDeck,
          decks: [testDeck],
          players: ["Sally"],
          isLoading: false,
        });
      });

      it("hides DeckSelector when keyboard shows", async () => {
        render(<Index />);

        await waitFor(() =>
          expect(screen.getByText(testDeck.name)).toBeVisible(),
        );

        // Simulate keyboard show
        act(() => {
          DeviceEventEmitter.emit("keyboardDidShow");
        });

        await waitFor(() => {
          expect(screen.queryByText(testDeck.name)).toBeNull();
        });
      });

      it("shows DeckSelector when keyboard hides", async () => {
        render(<Index />);

        await waitFor(() =>
          expect(screen.getByText(testDeck.name)).toBeVisible(),
        );

        act(() => {
          DeviceEventEmitter.emit("keyboardDidShow");
        });

        await waitFor(() => {
          expect(screen.queryByText(testDeck.name)).toBeNull();
        });

        act(() => {
          DeviceEventEmitter.emit("keyboardDidHide");
        });

        await waitFor(() => {
          expect(screen.getByText(testDeck.name)).toBeVisible();
        });
      });

      it("navigates to game screen on Get Started! press", () => {
        render(<Index />);

        const getStartedButton = screen.getByRole("button", {
          name: "Get Started!",
        });
        expect(getStartedButton).toBeVisible();

        fireEvent.press(getStartedButton);

        expect(screen.queryByText("No Deck selected")).toBeNull();
        expect(screen.queryByText("Selected Deck has no Cards")).toBeNull();
        expect(screen.queryByText("No Players added")).toBeNull();

        expect(router.navigate).toHaveBeenCalledWith({
          params: { id: testDeck.id },
          pathname: "/decks/[id]/play",
        });
      });
    });
  });
});
