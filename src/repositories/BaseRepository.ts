import { SQLiteDatabase } from "expo-sqlite";
import { InitialisationError } from "../errors/InitialisationError";
import { NotImplementedError } from "../errors/NotImplementedError";
import { ValidationError } from "../errors/ValidationError";

export abstract class BaseRepository {
  protected static db: SQLiteDatabase;

  static initialise(database: SQLiteDatabase) {
    this.db = database;
  }

  protected static extractMessage(
    e: Error,
    fallback: string = "Something went wrong",
  ): string {
    console.error(fallback, e.message);

    if (e instanceof InitialisationError) return e.message;
    if (e instanceof ValidationError) return e.message;

    return fallback;
  }

  protected static validateDb() {
    if (!this.db) {
      throw new InitialisationError(
        "Repository must be initialised with the .initialise function before use",
      );
    }
  }

  // Implement this in subclasses
  protected static validate(_patch: any) {
    throw new NotImplementedError();
  }
}
