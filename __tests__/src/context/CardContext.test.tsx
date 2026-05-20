import { CardFactory } from "@/factories/models/CardFactory";
import { DeckFactory } from "@/factories/models/DeckFactory";
import { CardContext, CardProvider } from "@/src/context/CardContext";
import { Deck } from "@/src/models/Deck";
import { CardRepository } from "@/src/repositories/CardRepository";
import { renderHook } from "@testing-library/react-native";
import { act, useContext } from "react";

jest.mock("expo-sqlite", () => ({
  useSQLiteContext: jest.fn(),
}));

describe("CardContext", () => {
  const renderCardContext = (deck: Deck | null = null) => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CardProvider deck={deck}>{children}</CardProvider>
    );

    const { result } = renderHook(() => useContext(CardContext), {
      wrapper,
    });

    return result;
  };

  it("defaults to empty collection of cards deck is null", async () => {
    const cardContext = renderCardContext();

    expect(cardContext.current.cards).toEqual([]);
  });

  it("errors out if createCard is called", async () => {
    const card = CardFactory();

    const cardContext = renderCardContext();

    try {
      await act(async () => {
        await cardContext.current.createCard({
          content: card.content,
        });
      });
    } catch (e: any) {
      expect(e.message).toEqual("CardContext must be initialised with a Deck");
    }

    // Assert context state has not updated
    expect(cardContext.current.cards).toEqual([]);
  });

  it("errors out if createManyCards is called", async () => {
    const card = CardFactory();

    const cardContext = renderCardContext();

    try {
      await act(async () => {
        await cardContext.current.createManyCards([
          {
            content: card.content,
          },
        ]);
      });
    } catch (e: any) {
      expect(e.message).toEqual("CardContext must be initialised with a Deck");
    }

    // Assert context state has not updated
    expect(cardContext.current.cards).toEqual([]);
  });

  describe("with deck provided", () => {
    const deck = DeckFactory();

    const card1 = CardFactory({
      id: 1,
      deck_id: deck.id,
      content: "Drink up!",
    });
    const card2 = CardFactory({
      id: 2,
      deck_id: deck.id,
      content: "Drink down!",
    });
    const card3 = CardFactory({
      id: 3,
      deck_id: deck.id,
      content: "Drink around!",
    });

    beforeEach(() => {
      jest
        .spyOn(CardRepository, "index")
        .mockReturnValue({ ok: true, payload: [card1, card2, card3] });
    });

    describe("#createCard", () => {
      const card = CardFactory();

      it("surfaces errors on unsuccessful response", async () => {
        jest.spyOn(CardRepository, "create").mockResolvedValueOnce({
          ok: false,
          message: "test error",
        });

        const cardContext = renderCardContext(deck);

        try {
          await act(async () => {
            await cardContext.current.createCard({
              content: card.content,
            });
          });
        } catch (e: any) {
          expect(e.message).toEqual("test error");
        }

        expect(CardRepository.create).toHaveBeenCalledTimes(1);
        expect(CardRepository.create).toHaveBeenCalledWith(deck.id, {
          content: card.content,
        });

        // Assert context state has not updated
        expect(cardContext.current.cards).toEqual([card1, card2, card3]);
      });

      it("creates card using the repository and updates context", async () => {
        jest
          .spyOn(CardRepository, "create")
          .mockResolvedValueOnce({ ok: true, payload: card });

        const cardContext = renderCardContext(deck);

        expect(cardContext.current.cards).toEqual([card1, card2, card3]);

        await act(async () => {
          await cardContext.current.createCard({
            content: card.content,
          });
        });

        expect(CardRepository.create).toHaveBeenCalledTimes(1);
        expect(CardRepository.create).toHaveBeenCalledWith(deck.id, {
          content: card.content,
        });

        // Assert context state updated
        expect(cardContext.current.cards).toEqual([card1, card2, card3, card]);
      });
    });

    describe("#createManyCards", () => {
      const card4 = CardFactory({
        id: 4,
        deck_id: deck.id,
        content: "Drink left!",
      });

      const card5 = CardFactory({
        id: 5,
        deck_id: deck.id,
        content: "Drink right!",
      });

      const card6 = CardFactory({
        id: 6,
        deck_id: deck.id,
        content: "Drink forwards!",
      });

      const cardPatches = [
        { content: card4.content },
        { content: card5.content },
        { content: card6.content },
      ];

      it("surfaces errors on unsuccessful response", async () => {
        jest.spyOn(CardRepository, "createMany").mockResolvedValueOnce({
          ok: false,
          message: "test error",
        });

        const cardContext = renderCardContext(deck);

        try {
          await act(async () => {
            await cardContext.current.createManyCards(cardPatches);
          });
        } catch (e: any) {
          expect(e.message).toEqual("test error");
        }

        expect(CardRepository.createMany).toHaveBeenCalledTimes(1);
        expect(CardRepository.createMany).toHaveBeenCalledWith(
          deck.id,
          cardPatches,
        );

        // Assert context state has not updated
        expect(cardContext.current.cards).toEqual([card1, card2, card3]);
      });

      it("creates cards using the repository and updates context", async () => {
        jest
          .spyOn(CardRepository, "createMany")
          .mockResolvedValueOnce({ ok: true, changes: 3 });

        expect(CardRepository.index).toHaveBeenCalledTimes(0);

        const cardContext = renderCardContext(deck);

        expect(CardRepository.index).toHaveBeenCalledTimes(2);

        expect(cardContext.current.cards).toEqual([card1, card2, card3]);

        await act(async () => {
          await cardContext.current.createManyCards(cardPatches);
        });

        expect(CardRepository.createMany).toHaveBeenCalledTimes(1);
        expect(CardRepository.createMany).toHaveBeenCalledWith(
          deck.id,
          cardPatches,
        );

        // State is set by fetching complete index from repository
        expect(CardRepository.index).toHaveBeenCalledTimes(3);
      });
    });

    describe("#deleteCard", () => {
      it("surfaces errors on unsuccessful response", async () => {
        jest.spyOn(CardRepository, "delete").mockResolvedValueOnce({
          ok: true,
          changes: 0,
          message: "test error",
        });

        const cardContext = renderCardContext(deck);

        try {
          await act(async () => {
            await cardContext.current.deleteCard(card2.id);
          });
        } catch (e: any) {
          expect(e.message).toEqual("test error");
        }

        expect(CardRepository.delete).toHaveBeenCalledTimes(1);
        expect(CardRepository.delete).toHaveBeenCalledWith(card2.id);

        // Assert context state has not updated
        expect(cardContext.current.cards).toEqual([card1, card2, card3]);
      });

      it("deletes card using the repository and updates context", async () => {
        jest
          .spyOn(CardRepository, "delete")
          .mockResolvedValueOnce({ ok: true, changes: 1 });

        const cardContext = renderCardContext(deck);

        expect(cardContext.current.cards).toEqual([card1, card2, card3]);

        await act(async () => {
          await cardContext.current.deleteCard(card2.id);
        });

        expect(CardRepository.delete).toHaveBeenCalledTimes(1);
        expect(CardRepository.delete).toHaveBeenCalledWith(card2.id);

        expect(cardContext.current.cards).toEqual([card1, card3]);
      });
    });
  });
});
