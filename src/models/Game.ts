import { GameState, NonEmptyArray, TDeck, TPlayers } from "../types";

export class Game {
  private readonly cards: NonEmptyArray<string>;
  private readonly players: TPlayers;

  private currentCards: string[];
  private currentPlayers: string[];

  constructor(startingDeck: TDeck, startingPlayers: TPlayers) {
    if (startingDeck.cards.length === 0) {
      throw TypeError("Deck has no cards");
    }

    if (startingPlayers.length === 0) {
      throw TypeError("Game has no players");
    }

    this.cards = startingDeck.cards;
    this.currentCards = [...startingDeck.cards];

    this.players = startingPlayers;
    this.currentPlayers = [...startingPlayers];
  }

  private resetDeck() {
    this.currentCards = [...this.cards];
  }

  private resetPlayers() {
    this.currentPlayers = [...this.players];
  }

  private randomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  public drawCard(): GameState {
    if (this.currentCards.length === 0) {
      this.resetDeck();
    }

    if (this.currentPlayers.length === 0) {
      this.resetPlayers();
    }

    const card = this.currentCards.splice(
      this.randomInt(this.currentCards.length),
      1,
    )[0];

    const player = this.currentPlayers.splice(
      this.randomInt(this.currentPlayers.length),
      1,
    )[0];

    return { card, player };
  }
}
