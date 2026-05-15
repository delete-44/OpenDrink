import { TDeckData } from "../types";

export class Deck {
  readonly id: number;
  name: string;
  created_at?: string;
  updated_at?: string;

  // TODO: Remove
  cards?: string[];

  // TODO: Remove the defaults
  constructor({
    id = -1,
    name,
    created_at = "1970-01-01",
    updated_at = "1970-01-02",
    cards = [],
  }: TDeckData) {
    this.id = id;
    this.name = name;
    this.cards = cards;

    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  toJson(): TDeckData {
    return {
      id: this.id,
      name: this.name,
      cards: this.cards,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  static fromJson({
    id,
    name,
    created_at,
    updated_at,
    cards,
  }: TDeckData): Deck {
    return new Deck({ id, name, created_at, updated_at, cards });
  }
}
