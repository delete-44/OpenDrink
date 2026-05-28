import { CardFactory } from "@/factories/models/CardFactory";
import { PlayerFactory } from "@/factories/models/PlayerFactory";
import { Card } from "@/src/models/Card";
import { Game } from "@/src/models/Game";
import { Player } from "@/src/models/Player";

describe("Game", () => {
  beforeEach(() => {
    jest.spyOn(Math, "random").mockReturnValue(0.123456789);
  });

  it("throws an error if deck is empty upon instantiation", () => {
    const cards = [] as Card[];
    const players = [PlayerFactory({ name: "Sally" })];

    try {
      new Game(cards, players);
    } catch (e: any) {
      expect(e.message).toEqual("Deck has no Cards");
    }
  });

  it("throws an error if player list is empty upon instantiation", () => {
    const cards = [CardFactory()];
    const players = [] as Player[];

    try {
      new Game(cards, players);
    } catch (e: any) {
      expect(e.message).toEqual("Game has no Players");
    }
  });

  it("shuffles players once it reaches the end of the list", () => {
    const cards = [
      CardFactory({ id: 1, content: "Card" }),
      CardFactory({ id: 2, content: "Card 2" }),
      CardFactory({ id: 3, content: "Card 3" }),
      CardFactory({ id: 4, content: "Card 4" }),
    ];
    const players = [
      PlayerFactory({ id: 1, name: "Sally" }),
      PlayerFactory({ id: 2, name: "Alice" }),
    ];

    const game = new Game(cards, players);

    expect(game.drawCard().player).toEqual(players[0]);
    expect(game.drawCard().player).toEqual(players[1]);
    expect(game.drawCard().player).toEqual(players[0]);
  });

  it("shuffles deck once it reaches the end of the list", () => {
    const cards = [
      CardFactory({ id: 1, content: "Card" }),
      CardFactory({ id: 2, content: "Card 2" }),
    ];
    const players = [
      PlayerFactory({ id: 1, name: "Sally" }),
      PlayerFactory({ id: 2, name: "Alice" }),
      PlayerFactory({ id: 3, name: "Rincewind" }),
      PlayerFactory({ id: 4, name: "Agnes" }),
    ];

    const game = new Game(cards, players);

    expect(game.drawCard().card).toEqual(cards[0]);
    expect(game.drawCard().card).toEqual(cards[1]);
    expect(game.drawCard().card).toEqual(cards[0]);
  });
});
