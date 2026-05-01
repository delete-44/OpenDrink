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
  beforeEach(() => {
    jest.spyOn(React, "useContext").mockReturnValue({
      decks: [{ id: "1", name: "Default", cards: ["Card 1"] }],
      currentDeckIndex: 0,
      isLoading: false,
    });
  });

  it("hides DeckSelector when keyboard shows", async () => {
    render(<Index />);

    await waitFor(() => expect(screen.getByText("Default")).toBeTruthy());

    // Simulate keyboard show
    act(() => {
      DeviceEventEmitter.emit("keyboardDidShow");
    });

    await waitFor(() => {
      expect(screen.queryByText("Default")).toBeNull();
    });
  });

  it("shows DeckSelector when keyboard hides", async () => {
    render(<Index />);

    await waitFor(() => expect(screen.getByText("Default")).toBeTruthy());

    act(() => {
      DeviceEventEmitter.emit("keyboardDidShow");
    });

    await waitFor(() => {
      expect(screen.queryByText("Default")).toBeNull();
    });

    act(() => {
      DeviceEventEmitter.emit("keyboardDidHide");
    });

    await waitFor(() => {
      expect(screen.getByText("Default")).toBeVisible();
    });
  });

  it("navigates to game screen on Get Started! press", () => {
    render(<Index />);

    const getStartedButton = screen.getByRole("button", {
      name: "Get Started!",
    });
    expect(getStartedButton).toBeVisible();

    fireEvent.press(getStartedButton);
    expect(router.navigate).toHaveBeenCalledWith("/game");
  });
});
