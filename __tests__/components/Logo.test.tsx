import Logo from "@/components/Logo";
import { render, screen } from "@testing-library/react-native";

describe("Logo", () => {
  it("renders markup - the image", () => {
    render(<Logo />);

    expect(screen.getByRole("img")).toBeVisible();
  });
});
