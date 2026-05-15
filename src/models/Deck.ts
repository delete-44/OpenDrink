import { SQLiteDatabase } from "expo-sqlite";
import { Card, TCardData } from "./Card";

export type TDeckData = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  cards: string[];
};

export type TDeckEditableData = Pick<TDeckData, "name" | "updated_at">;

export class Deck {
  readonly id: number;
  name: string;
  created_at: string;
  updated_at: string;

  cards: string[];

  constructor(
    name: string,
    cards: string[],
    id?: number,
    created_at?: string,
    updated_at?: string,
  ) {
    this.id = id || -1;
    this.name = name;
    this.created_at = created_at || "";
    this.updated_at = updated_at || "";

    this.cards = cards;

    // cards.map(() => Card.create() etc...)
  }

  async xCards(db: SQLiteDatabase) {
    const cards: TCardData[] = await db.getAllAsync(
      `SELECT * FROM cards WHERE deck_id=?`,
      this.id,
    );

    return cards.map((cardData) => Card.fromJson(cardData));
  }

  toJson(): TDeckData {
    return {
      id: this.id,
      name: this.name,
      created_at: this.created_at,
      updated_at: this.updated_at,
      cards: this.cards,
    };
  }

  static fromJson({ name, cards, id }: TDeckData): Deck {
    return new Deck(name, cards, id);
  }

  static async index(db: SQLiteDatabase): Promise<Deck[]> {
    const decks: TDeckData[] = await db.getAllAsync(`SELECT * FROM decks`);

    return decks.map((deckData) => Deck.fromJson(deckData));
  }

  static find(id: number) {
    // Find deck by ID
    // Throw on missing
  }

  static create({ name }: TDeckEditableData) {
    // Instantiate object
    // Add deck to DB
    // Return new deck
    // Throw on validation error
  }

  static update(id: number, patch: TDeckEditableData) {
    // Update object in DB
    // Throw on error
    // Return updated
    // Set updated_at
  }

  static destroy(id: number) {
    // Find item
    // Throw on missing
    // Destroy in DB
    // Return true
  }
}
