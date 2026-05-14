import { type SQLiteDatabase } from "expo-sqlite";
import { migrate__1CreateDb } from "./migrations/1-create-db.sql";
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
    await migrate__1CreateDb(db);

    currentDbVersion = 1;
  }

  // Subsequent migrations go here

  // Initialise default deck - required even in prod
  await seed(db);

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
