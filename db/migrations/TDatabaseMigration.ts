import { SQLiteDatabase } from "expo-sqlite";

export type TDatabaseMigration = {
  name: string;
  up: (db: SQLiteDatabase) => Promise<void>;
};
