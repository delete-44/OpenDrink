import { SQLiteDatabase } from "expo-sqlite";

export abstract class BaseRepository {
  protected static db: SQLiteDatabase;

  static initialise(database: SQLiteDatabase) {
    this.db = database;
  }
}
