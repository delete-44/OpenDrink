export type TDeckData = {
  id: string;
  name: string;
  cards: string[];
};

export type TDeckEditableData = Pick<TDeckData, "name" | "cards">;

export class Deck {
  readonly id: string;
  name: string;
  cards: string[];

  constructor(name: string, cards: string[], id?: string) {
    this.id = id || `${Date.now()}_${Math.random()}`;
    this.name = name;
    this.cards = cards;
  }

  toJson(): TDeckData {
    return {
      id: this.id,
      name: this.name,
      cards: this.cards,
    };
  }

  xCards() {
    // To replace .cards prop
    // Find all cards that are associated with this deck
  }

  static fromJson({ name, cards, id }: TDeckData): Deck {
    return new Deck(name, cards, id);
  }

  static index() {
    // Get all
  }

  static find(id: string) {
    // Find deck by ID
    // Throw on missing
  }

  static create({ name, cards }: TDeckEditableData) {
    // Instantiate object
    // Add deck to DB
    // Return new deck
    // Throw on validation error
  }

  static update(id: string, patch: TDeckEditableData) {
    // Update object in DB
    // Throw on error
    // Return updated
  }

  static destroy(id: string) {
    // Find item
    // Throw on missing
    // Destroy in DB
    // Return true
  }
}
