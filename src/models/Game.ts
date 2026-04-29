import { GameState, TDeck, TPlayers } from "../types";

export class Game {
  private readonly deck: TDeck;
  private readonly players: TPlayers;

  private currentDeck: string[];
  private currentPlayers: string[];

  constructor(startingDeck: TDeck, startingPlayers: TPlayers) {
    this.deck = startingDeck;
    this.currentDeck = startingDeck;

    this.players = startingPlayers;
    this.currentPlayers = startingPlayers;
  }

  private resetDeck() {
    this.currentDeck = [...this.deck];
  }

  private resetPlayers() {
    this.currentPlayers = [...this.players];
  }

  public drawCard(): GameState {
    if (this.currentDeck.length === 0) {
      this.resetDeck();
    }

    if (this.currentPlayers.length === 0) {
      this.resetPlayers();
    }

    const card = this.currentDeck.pop() as string;
    const player = this.currentPlayers.pop() as string;

    return { card, player };
  }
}
