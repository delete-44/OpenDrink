import { SQLiteDatabase } from "expo-sqlite";

export abstract class BaseRepository {
  protected static db: SQLiteDatabase;

  static initialise(database: SQLiteDatabase) {
    this.db = database;
  }

  protected static validate(_patch: any) {
    throw new Error("Not implemented");
  }
}
