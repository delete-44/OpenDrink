import { Deck } from "@/src/models/Deck";
import { Game } from "@/src/models/Game";
import { TPlayers } from "@/src/types";

describe("Game", () => {
  beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.123456789);
  });

  it("throws an error if deck is empty upon instantiation", () => {
    const deck = new Deck("Test deck", []);
    const players = ["Sally"];

    try {
      new Game(deck, players);
    } catch (e: any) {
      expect(e.message).toEqual("Deck has no Cards");
    }
  });

  it("throws an error if player list is empty upon instantiation", () => {
    const deck = new Deck("Test deck", ["Test card"]);
    const players = [] as TPlayers;

    try {
      new Game(deck, players);
    } catch (e: any) {
      expect(e.message).toEqual("Game has no Players");
    }
  });

  it("shuffles players once it reaches the end of the list", () => {
    const deck = new Deck("Test deck", ["Card", "Card 2", "Card 3", "Card 4"]);
    const players = ["Sally", "Alice"];

    const game = new Game(deck, players);

    expect(game.drawCard().player).toEqual("Sally");
    expect(game.drawCard().player).toEqual("Alice");
    expect(game.drawCard().player).toEqual("Sally");
  });

  it("shuffles deck once it reaches the end of the list", () => {
    const deck = new Deck("Test deck", ["Card", "Card 2"]);
    const players = ["Sally", "Alice", "Rincewind", "The Dean"];

    const game = new Game(deck, players);

    expect(game.drawCard().card).toEqual("Card");
    expect(game.drawCard().card).toEqual("Card 2");
    expect(game.drawCard().card).toEqual("Card");
  });
});
