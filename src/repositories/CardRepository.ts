import { ValidationError } from "../errors/ValidationError";
import { Card } from "../models/Card";
import {
  TCardData,
  TCollectionResponse,
  TItemResponse,
  TPatchResponse,
} from "../types";
import { BaseRepository } from "./BaseRepository";

export type CardPermittedFields = Pick<TCardData, "content">;

export class CardRepository extends BaseRepository {
  protected static validate({ content }: CardPermittedFields) {
    if (!content) {
      throw new ValidationError("Card cannot be empty");
    }

    if (content.length > 500) {
      throw new ValidationError("Maximum length is 500 characters");
    }
  }

  static index(deckId: number): TCollectionResponse<Card> {
    try {
      this.validateDb();

      const result: TCardData[] = this.db.getAllSync(
        "SELECT * FROM cards WHERE deck_id=?",
        deckId,
      );

      return {
        ok: true,
        payload: result.map((c) => Card.fromJson(c)),
      };
    } catch (e: any) {
      return {
        ok: false,
        message: this.extractMessage(e, "Error loading Cards"),
        payload: [],
      };
    }
  }

  static async create(
    deckId: number,
    { content }: CardPermittedFields,
  ): Promise<TItemResponse<Card>> {
    try {
      this.validateDb();
      this.validate({ content: content.trim() });

      const created = await this.db.runAsync(
        `INSERT INTO cards ("deck_id", "content") VALUES (?, ?)`,
        deckId,
        content.trim(),
      );

      const result: TCardData | null = await this.db.getFirstAsync(
        "SELECT * FROM cards WHERE id=?",
        created.lastInsertRowId,
      );

      if (!result) {
        return {
          ok: false,
          message: `Card not found`,
        };
      }

      return {
        ok: true,
        payload: Card.fromJson(result),
      };
    } catch (e: any) {
      return {
        ok: false,
        message: this.extractMessage(e, "Error creating Card"),
      };
    }
  }

  static async createMany(
    deckId: number,
    patches: CardPermittedFields[],
  ): Promise<TPatchResponse> {
    try {
      this.validateDb();

      let changes = 0;
      await this.db.withTransactionAsync(async () => {
        for (const patch of patches) {
          await this.db.runAsync(
            `INSERT INTO cards ("deck_id", "content") VALUES (?, ?)`,
            deckId,
            patch.content,
          );

          changes++;
        }
      });

      return {
        ok: true,
        changes,
      };
    } catch (e: any) {
      return {
        ok: false,
        message: this.extractMessage(e, "Error creating Cards"),
        changes: 0,
      };
    }
  }

  static async delete(id: number): Promise<TPatchResponse> {
    try {
      this.validateDb();

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
      return {
        ok: false,
        message: this.extractMessage(e, "Error deleting Card"),
        changes: 0,
      };
    }
  }
}
