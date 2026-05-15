import migration1 from "./001-initialise-db";
import { TDatabaseMigration } from "./TDatabaseMigration";

export const allMigrations: TDatabaseMigration[] = [migration1];
