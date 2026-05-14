import { type SQLiteDatabase } from "expo-sqlite";
import { migrate__1CreateDb } from "./migrations/1-create-db.sql";
import { seed } from "./seed";

export async function migrate(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let { user_version } = (await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version")) || { user_version: 0 };

  console.log("db_init", user_version);

  if (user_version >= DATABASE_VERSION) {
    return;
  }

  if (user_version === 0) {
    await migrate__1CreateDb(db);

    // await db.runAsync(
    //   "INSERT INTO todos (value, intValue) VALUES (?, ?)",
    //   "hello",
    //   1,
    // );
    // await db.runAsync(
    //   "INSERT INTO todos (value, intValue) VALUES (?, ?)",
    //   "world",
    //   2,
    // );

    user_version = 1;
  }

  // Subsequent migrations go here

  console.log("db_seeding");
  await seed(db);

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
