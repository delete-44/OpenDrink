import DEFAULT_DECK from "@/src/constants/default-deck";
import { SQLiteDatabase } from "expo-sqlite";

export async function seed(db: SQLiteDatabase) {
  await db.withTransactionAsync(async () => {
    console.log("[DB] Seeding default deck...");

    const result = await db.runAsync(
      "INSERT INTO decks (name) VALUES (?)",
      DEFAULT_DECK.name,
    );

    for (const card of DEFAULT_DECK.cards) {
      await db.runAsync("INSERT INTO cards (deck_id, content) VALUES (?, ?)", [
        result.lastInsertRowId,
        card,
      ]);
    }
  });

  console.log("[DB] ... Seeding complete");
}
