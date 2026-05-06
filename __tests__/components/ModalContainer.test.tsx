import ModalContainer from "@/components/ModalContainer";
import { fireEvent, render, screen } from "@testing-library/react-native";

describe("ModalContainer", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders markup - title bar + close button", () => {
    render(
      <ModalContainer title="Test Modal" isVisible onClose={mockOnClose} />,
    );

    const title = screen.getByText("Test Modal");
    const closeButton = screen.getByRole("button", { name: "Close Modal" });

    expect(title).toBeVisible();
    expect(closeButton).toBeVisible();
  });

  it("allows users to close the modal by clicking cross", () => {
    render(
      <ModalContainer title="Test Modal" isVisible onClose={mockOnClose} />,
    );

    fireEvent.press(screen.getByRole("button", { name: "Close Modal" }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
