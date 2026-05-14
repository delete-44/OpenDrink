import { type SQLiteDatabase } from "expo-sqlite";
import { TDatabaseMigration } from "../TDatabaseMigration";

const migration: TDatabaseMigration = {
  name: "Create Base DB",
  up: async (db: SQLiteDatabase) => {
    await db.execAsync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS DECKS (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );

      CREATE TABLE IF NOT EXISTS CARDS (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deck_id INTEGER NOT NULL,
        FOREIGN KEY (deck_id)
        REFERENCES decks (id)
          ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS PLAYERS (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );

      CREATE INDEX IF NOT EXISTS cardindex ON cards(deck_id);`);
  },
};

export default migration;
