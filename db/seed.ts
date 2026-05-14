import DEFAULT_DECK from "@/src/constants/default-deck";
import { SQLiteDatabase } from "expo-sqlite";

export async function seed(db: SQLiteDatabase) {
  const result = await db.runAsync(
    "INSERT INTO decks (name) VALUES (?)",
    DEFAULT_DECK.name,
  );

  console.log("HERE!", result);
  // await db.withTransactionAsync(async () => {
  //   for (const card of DEFAULT_DECK.cards) {
  //     await db.runAsync(
  //       "INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)",
  //       [contact.name, contact.email, contact.phone],
  //     );
  //   }
  // });

  await db.runAsync("INSERT INTO ");
}
