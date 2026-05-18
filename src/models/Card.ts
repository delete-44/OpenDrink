import { TCardData } from "../types";

export class Card {
  readonly id: number;
  deck_id: number;
  content: string;
  created_at: string;
  updated_at: string;

  constructor({ id, deck_id, content, created_at, updated_at }: TCardData) {
    this.id = id;
    this.deck_id = deck_id;
    this.content = content;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  toJson(): TCardData {
    return {
      id: this.id,
      deck_id: this.deck_id,
      content: this.content,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  static fromJson(jsonData: TCardData): Card {
    return new Card(jsonData);
  }
}
