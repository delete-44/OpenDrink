import { TDeck } from "../types";

export class Deck {
  readonly id: string;
  name: string;
  cards: string[];

  constructor(name: string, cards: string[], id?: string) {
    this.id = id || `${Date.now()}_${Math.random()}`;
    this.name = name;
    this.cards = cards;
  }

  setCards(cards: string[]) {
    this.cards = cards;
  }

  toJson(): TDeck {
    return {
      id: this.id,
      name: this.name,
      cards: this.cards,
    };
  }

  static fromJson({ name, cards, id }: TDeck): Deck {
    return new Deck(name, cards, id);
  }
}
