import { type SQLiteDatabase } from "expo-sqlite";
import migration1 from "./migrations/001-initialise-db";
import { seed } from "./seed";

export async function migrate(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;

  let pragmaUserVersion = await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version");

  let currentDbVersion = pragmaUserVersion?.user_version || 0;

  console.log("[DB] Initialising DB at version:", currentDbVersion);

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    console.log("[DB] Executing migration: ", migration1.name);
    await migration1.up(db);

    currentDbVersion = 1;
  }

  // Subsequent migrations go here

  // Initialise default deck - required even in prod
  await seed(db);

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
