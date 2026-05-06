import ModalContainer from "@/components/ModalContainer";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

describe("ModalContainer", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders markup - backdrop + title bar + close button", () => {
    render(
      <ModalContainer title="Test Modal" isVisible onClose={mockOnClose} />,
    );

    const title = screen.getByText("Test Modal");
    const backdrop = screen.getAllByRole("button", { name: "Close Modal" })[0];
    const closeButton = screen.getAllByRole("button", {
      name: "Close Modal",
    })[1];

    expect(title).toBeVisible();
    expect(backdrop).toBeVisible();
    expect(closeButton).toBeVisible();

    expect(backdrop).toHaveStyle(StyleSheet.absoluteFill);
  });

  it("allows user to close the modal by clicking the backdrop", () => {
    render(
      <ModalContainer title="Test Modal" isVisible onClose={mockOnClose} />,
    );

    fireEvent.press(screen.getAllByRole("button", { name: "Close Modal" })[0]);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("allows users to close the modal by clicking cross", () => {
    render(
      <ModalContainer title="Test Modal" isVisible onClose={mockOnClose} />,
    );

    fireEvent.press(screen.getAllByRole("button", { name: "Close Modal" })[1]);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
