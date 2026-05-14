export type TCardData = {
  id: string;
  deckId: string;
  content: string;
};

export type TCardEditableData = Pick<TCardData, "content">;

export class Card {
  readonly id: string;
  deckId: string;
  content: string;

  constructor(deckId: string, content: string, id?: string) {
    this.id = id || `${Date.now()}_${Math.random()}`;
    this.deckId = deckId;
    this.content = content;
  }

  toJson(): TCardData {
    return {
      id: this.id,
      deckId: this.deckId,
      content: this.content,
    };
  }

  deck() {
    // Traverse to deck that this card belongs to
  }

  static fromJson({ deckId, content, id }: TCardData): Card {
    return new Card(deckId, content, id);
  }

  static index(deckId: string) {
    // Get all belonging to deck
  }

  static find(id: string) {
    // Find card by ID
    // Throw on missing
  }

  static create({ content }: TCardEditableData) {
    // Instantiate object
    // Add card to DB
    // Return new card
    // Throw on validation error
  }

  static destroy(id: string) {
    // Find item
    // Throw on missing
    // Destroy in DB
    // Return true
  }
}
