import DeckTitlebar from "@/components/DeckTitlebar";
import { StorageContext } from "@/context/StorageContext";
import { render } from "@testing-library/react-native";
import React from "react";
import { BaseMockStorageContext, BaseTestDeck } from "../../test-utils";

describe("DeckTitlebar", () => {
  const mockUpdateDeck = jest.fn();

  const mockStorageContext = {
    ...BaseMockStorageContext,
    updateDeck: mockUpdateDeck,
  };

  beforeEach(() => {
    render(
      <StorageContext.Provider value={mockStorageContext}>
        <DeckTitlebar currentDeck={BaseTestDeck} />
      </StorageContext.Provider>,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders base markup", () => {
    // TODO...
  });
});
