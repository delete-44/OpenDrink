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
  static async index(): Promise<TCollectionResponse<Player>> {
    try {
      const result: TPlayerData[] = await this.db.getAllAsync(
        "SELECT * FROM players",
      );

      return {
        ok: true,
        payload: result.map((p) => Player.fromJson(p)),
      };
    } catch (e: any) {
      console.log("Error loading Players:", e.message);

      return {
        ok: false,
        message: "Error loading Players",
        payload: [],
      };
    }
  }

  static async create({
    name,
  }: PlayerPermittedFields): Promise<TItemResponse<Player>> {
    try {
      const created = await this.db.runAsync(
        `INSERT INTO players ("name") VALUES (?)`,
        name,
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
      console.log("Error creating Player:", e.message);

      return {
        ok: false,
        message: "Error creating Player",
      };
    }
  }

  static async delete(id: number): Promise<TPatchResponse> {
    try {
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
      console.log("Error deleting Player:", e.message);

      return {
        ok: false,
        message: "Error deleting Player",
        changes: 0,
      };
    }
  }
}
