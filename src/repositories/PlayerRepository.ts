import { ValidationError } from "../errors/ValidationError";
import { Player } from "../models/Player";
import {
  TCollectionResponse,
  TItemResponse,
  TPatchResponse,
  TPlayerData,
} from "../types";
import { BaseRepository } from "./BaseRepository";

export type PlayerPermittedFields = Pick<TPlayerData, "name">;

export class PlayerRepository extends BaseRepository {
  protected static validate({ name }: PlayerPermittedFields) {
    if (!name) {
      throw new ValidationError("Player name cannot be empty");
    }

    if (name.length > 100) {
      throw new ValidationError("Maximum length is 100 characters");
    }
  }

  static async index(): Promise<TCollectionResponse<Player>> {
    try {
      this.validateDb();

      const result: TPlayerData[] = await this.db.getAllAsync(
        "SELECT * FROM players",
      );

      return {
        ok: true,
        payload: result.map((p) => Player.fromJson(p)),
      };
    } catch (e: any) {
      return {
        ok: false,
        message: this.extractMessage(e, "Error loading Players"),
        payload: [],
      };
    }
  }

  static async create({
    name,
  }: PlayerPermittedFields): Promise<TItemResponse<Player>> {
    try {
      this.validateDb();
      this.validate({ name: name.trim() });

      const created = await this.db.runAsync(
        `INSERT INTO players ("name") VALUES (?)`,
        name.trim(),
      );

      const result: TPlayerData | null = await this.db.getFirstAsync(
        "SELECT * FROM players WHERE id=?",
        created.lastInsertRowId,
      );

      if (!result) {
        return {
          ok: false,
          message: `Player not found`,
        };
      }

      return {
        ok: true,
        payload: Player.fromJson(result),
      };
    } catch (e: any) {
      return {
        ok: false,
        message: this.extractMessage(e, "Error creating Player"),
      };
    }
  }

  static async delete(id: number): Promise<TPatchResponse> {
    try {
      this.validateDb();

      const result = await this.db.runAsync(
        `DELETE FROM players WHERE id=?`,
        id,
      );

      if (result.changes === 0) {
        return {
          ok: false,
          message: `Player ${id} not found`,
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
        message: this.extractMessage(e, "Error deleting Player"),
        changes: 0,
      };
    }
  }
}
