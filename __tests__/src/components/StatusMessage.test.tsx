import globalStyles from "@/assets/global-styles";
import StatusMessage from "@/src/components/StatusMessage";
import { render, screen } from "@testing-library/react-native";

describe("StatusMessage", () => {
  const label = "Test Component";

  it("returns null if no message provided", () => {
    render(<StatusMessage type="warning" message="" describes={label} />);

    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("renders a success message if type=success", () => {
    render(
      <StatusMessage
        type="success"
        message="Something went right :)"
        describes={label}
      />,
    );

    expect(screen.getByRole("alert")).toBeVisible();
    expect(screen.getByText("Something went right :)")).toHaveStyle(
      globalStyles.textSuccess,
    );
  });

  it("renders a warning icon if type=warning", () => {
    render(
      <StatusMessage
        type="warning"
        message="Something went wrong :("
        describes={label}
      />,
    );

    expect(screen.getByRole("alert")).toBeVisible();
    expect(screen.getByText("Something went wrong :(")).toHaveStyle(
      globalStyles.textWarning,
    );
  });
});
