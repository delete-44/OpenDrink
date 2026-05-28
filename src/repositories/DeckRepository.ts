import { ValidationError } from "../errors/ValidationError";
import { Deck } from "../models/Deck";
import {
  TCollectionResponse,
  TDeckData,
  TItemResponse,
  TPatchResponse,
} from "../types";
import { BaseRepository } from "./BaseRepository";

export type DeckPermittedFields = Pick<TDeckData, "name">;

export class DeckRepository extends BaseRepository {
  protected static validate({ name }: DeckPermittedFields) {
    if (!name) {
      throw new ValidationError("Deck name cannot be empty");
    }

    if (name.length > 100) {
      throw new ValidationError("Maximum length is 100 characters");
    }
  }

  static async index(): Promise<TCollectionResponse<Deck>> {
    try {
      const result: TDeckData[] = await this.db.getAllAsync(
        "SELECT * FROM decks",
      );

      return {
        ok: true,
        payload: result.map((d) => Deck.fromJson(d)),
      };
    } catch (e: any) {
      console.log("Error loading Decks:", e.message);

      return {
        ok: false,
        message: "Error loading Decks",
        payload: [],
      };
    }
  }

  static async find(id: number): Promise<TItemResponse<Deck>> {
    try {
      const result: TDeckData | null = await this.db.getFirstAsync(
        "SELECT * FROM decks WHERE id=?",
        id,
      );

      if (!result) {
        return {
          ok: false,
          message: `Deck ${id} not found`,
        };
      }

      return {
        ok: true,
        payload: Deck.fromJson(result),
      };
    } catch (e: any) {
      console.log("Error loading Decks:", e.message);

      return {
        ok: false,
        message: "Error loading Deck",
      };
    }
  }

  static async create({
    name,
  }: DeckPermittedFields): Promise<TItemResponse<Deck>> {
    try {
      this.validate({ name: name.trim() });

      const created = await this.db.runAsync(
        `INSERT INTO decks ("name") VALUES (?)`,
        name.trim(),
      );

      const result: TDeckData | null = await this.db.getFirstAsync(
        "SELECT * FROM decks WHERE id=?",
        created.lastInsertRowId,
      );

      if (!result) {
        return {
          ok: false,
          message: `Deck not found`,
        };
      }

      return {
        ok: true,
        payload: Deck.fromJson(result),
      };
    } catch (e: any) {
      console.log("Error creating Deck:", e.message);

      const message =
        e instanceof ValidationError ? e.message : "Error creating Deck";

      return {
        ok: false,
        message,
      };
    }
  }

  static async update(
    id: number,
    { name }: DeckPermittedFields,
  ): Promise<TPatchResponse> {
    try {
      this.validate({ name: name.trim() });

      const result = await this.db.runAsync(
        `UPDATE decks SET name=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
        name.trim(),
        id,
      );

      if (result.changes === 0) {
        return {
          ok: false,
          message: `Deck ${id} not found`,
          changes: result.changes,
        };
      }

      return {
        ok: true,
        changes: result.changes,
      };
    } catch (e: any) {
      console.log("Error updating Deck:", e.message);

      const message =
        e instanceof ValidationError ? e.message : "Error updating Deck";

      return {
        ok: false,
        message,
        changes: 0,
      };
    }
  }

  static async delete(id: number): Promise<TPatchResponse> {
    try {
      const result = await this.db.runAsync(`DELETE FROM decks WHERE id=?`, id);

      if (result.changes === 0) {
        return {
          ok: false,
          message: `Deck ${id} not found`,
          changes: result.changes,
        };
      }

      return {
        ok: true,
        changes: result.changes,
      };
    } catch (e: any) {
      console.log("Error deleting Deck:", e.message);

      return {
        ok: false,
        message: "Error deleting Deck",
        changes: 0,
      };
    }
  }
}
