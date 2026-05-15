import { TDatabaseMigration } from "@/db/migrations/TDatabaseMigration";

export default function MigrationFactory(
  overrides: Partial<TDatabaseMigration> = {},
): TDatabaseMigration {
  return {
    name: "Test Migration",
    up: jest.fn(),
    ...overrides,
  };
}
