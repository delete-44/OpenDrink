import Logo from "@/src/components/Logo";
import { render, screen } from "@testing-library/react-native";

describe("Logo", () => {
  it("renders markup - the image", () => {
    render(<Logo />);

    expect(screen.getByTestId("logo")).toBeVisible();
  });
});
