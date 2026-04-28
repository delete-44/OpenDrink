import { render, screen, waitFor } from "@testing-library/react-native";
import { act } from "react";
import { DeviceEventEmitter } from "react-native";
import Index from "../app/index";

describe("Index", () => {
  beforeEach(() => {});

  it("should hide DeckSelector when keyboard shows", async () => {
    render(<Index />);

    expect(screen.getByText("Default")).toBeVisible();

    // Simulate keyboard show
    act(() => {
      DeviceEventEmitter.emit("keyboardDidShow");
    });

    await waitFor(() => {
      expect(screen.queryByText("Default")).toBeNull();
    });
  });

  it("should show DeckSelector when keyboard hides", async () => {
    render(<Index />);

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
});
