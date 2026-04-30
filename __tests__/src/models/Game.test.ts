import { Game } from "@/src/models/Game";
import { TDeck, TPlayers } from "@/src/types";

describe("Game", () => {
  it("throws an error if deck is empty upon instantiation", () => {
    const deck = { name: "Test deck", cards: [] };
    const players = ["Sally"];

    try {
      // @ts-expect-error - We know the deck is invalid, that's what we're testing
      new Game(deck as TDeck, players);
    } catch (e: any) {
      expect(e.message).toEqual("Deck has no cards");
    }
  });

  it("throws an error if player list is empty upon instantiation", () => {
    const deck = { name: "Test deck", cards: ["Test card"] };
    const players = [] as TPlayers;

    try {
      new Game(deck as TDeck, players);
    } catch (e: any) {
      expect(e.message).toEqual("Game has no players");
    }
  });

  it("shuffles players once it reaches the end of the list", () => {
    const deck = {
      name: "Test Deck",
      cards: ["Card", "Card 2", "Card 3", "Card 4"],
    };
    const players = ["Sally", "Alice"];

    const game = new Game(deck as TDeck, players as TPlayers);

    expect(game.drawCard().player).toEqual("Alice");
    expect(game.drawCard().player).toEqual("Sally");
    expect(game.drawCard().player).toEqual("Alice");
  });

  it("shuffles deck once it reaches the end of the list", () => {
    const deck = {
      name: "Test Deck",
      cards: ["Card", "Card 2"],
    };
    const players = ["Sally", "Alice", "Rincewind", "The Dean"];

    const game = new Game(deck as TDeck, players as TPlayers);

    expect(game.drawCard().card).toEqual("Card 2");
    expect(game.drawCard().card).toEqual("Card");
    expect(game.drawCard().card).toEqual("Card 2");
  });
});
