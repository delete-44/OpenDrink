import { TPlayerData } from "../types";

export class Player {
  readonly id: number;
  name: string;
  created_at: string;
  updated_at: string;

  constructor({ id, name, created_at, updated_at }: TPlayerData) {
    this.id = id;
    this.name = name;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  toJson(): TPlayerData {
    return {
      id: this.id,
      name: this.name,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  static fromJson(jsonData: TPlayerData): Player {
    return new Player(jsonData);
  }
}
