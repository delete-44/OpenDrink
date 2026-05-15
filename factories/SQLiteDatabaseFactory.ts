import { SQLiteDatabase } from "expo-sqlite";

export default function SQLiteDatabaseFactory(
  overrides: Partial<SQLiteDatabase> = {},
): SQLiteDatabase {
  // Mocking the whole object is a pain in the ass
  // So, just mocking the functions we're likely to use:
  // @ts-expect-error
  return {
    runAsync: jest.fn(),
    getFirstAsync: jest.fn(),
    getEachAsync: jest.fn(),
    getAllAsync: jest.fn(),
    runSync: jest.fn(),
    getFirstSync: jest.fn(),
    getEachSync: jest.fn(),
    getAllSync: jest.fn(),
    withTransactionAsync: jest.fn(),
    execAsync: jest.fn(),

    ...overrides,
  };
}
