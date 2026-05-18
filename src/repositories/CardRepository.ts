import { Card } from "../models/Card";
import {
  TCardData,
  TCollectionResponse,
  TPartialResponse,
  TPatchResponse,
} from "../types";
import { BaseRepository } from "./BaseRepository";

export type CardPermittedFields = Pick<TCardData, "content">;

export class CardRepository extends BaseRepository {
  static async index(deckId: number): Promise<TCollectionResponse<Card>> {
    try {
      const result: TCardData[] = await this.db.getAllAsync(
        "SELECT * FROM cards WHERE deck_id=?",
        deckId,
      );

      return {
        ok: true,
        payload: result.map((c) => Card.fromJson(c)),
      };
    } catch (e: any) {
      console.log("Error loading Cards:", e.message);

      return {
        ok: false,
        message: "Error loading Cards",
      };
    }
  }

  static async create(
    deckId: number,
    { content }: CardPermittedFields,
  ): Promise<TPartialResponse<Card>> {
    try {
      const result = await this.db.runAsync(
        `INSERT INTO cards ("deck_id", "content") VALUES (?, ?)`,
        deckId,
        content,
      );

      return {
        ok: true,
        payload: {
          id: result.lastInsertRowId,
          content,
        },
      };
    } catch (e: any) {
      console.log("Error creating Card:", e.message);

      return {
        ok: false,
        message: "Error creating Card",
      };
    }
  }

  static async delete(id: number): Promise<TPatchResponse> {
    try {
      const result = await this.db.runAsync(`DELETE FROM cards WHERE id=?`, id);

      if (result.changes === 0) {
        return {
          ok: false,
          message: `Card ${id} not found`,
          changes: result.changes,
        };
      }

      return {
        ok: true,
        changes: result.changes,
      };
    } catch (e: any) {
      console.log("Error deleting Card:", e.message);

      return {
        ok: false,
        message: "Error deleting Card",
        changes: 0,
      };
    }
  }
}
