import { migrate } from "@/db/migrate";
import MigrationFactory from "@/factories/MigrationFactory";
import SQLiteDatabaseFactory from "@/factories/SQLiteDatabaseFactory";

describe("migrate", () => {
  const mockUp1 = jest.fn();
  const mockUp2 = jest.fn();
  const mockUp3 = jest.fn();
  const mockUp4 = jest.fn();
  const mockUp5 = jest.fn();

  const migrations1 = MigrationFactory({ up: mockUp1 });
  const migrations2 = MigrationFactory({ up: mockUp2 });
  const migrations3 = MigrationFactory({ up: mockUp3 });
  const migrations4 = MigrationFactory({ up: mockUp4 });
  const migrations5 = MigrationFactory({ up: mockUp5 });

  const migrations = [
    migrations1,
    migrations2,
    migrations3,
    migrations4,
    migrations5,
  ];

  const mockWithTransactionAsync = jest
    .fn()
    .mockImplementation(async (fn) => await fn());
  const mockExecAsync = jest.fn();
  const mockGetFirstAsync = jest.fn();

  const mockDb = SQLiteDatabaseFactory({
    withTransactionAsync: mockWithTransactionAsync,
    execAsync: mockExecAsync,
    getFirstAsync: mockGetFirstAsync,
  });

  it("saves progress in DB if migration step fails", async () => {
    mockUp3.mockRejectedValueOnce(new Error("test error"));

    await migrate(mockDb, migrations);

    expect(mockWithTransactionAsync).toHaveBeenCalledTimes(3);

    expect(mockUp1).toHaveBeenCalledWith(mockDb);
    expect(mockUp2).toHaveBeenCalledWith(mockDb);
    expect(mockUp3).toHaveBeenCalledWith(mockDb);
    expect(mockUp4).not.toHaveBeenCalled();
    expect(mockUp5).not.toHaveBeenCalled();

    expect(mockExecAsync).toHaveBeenCalledWith("PRAGMA user_version = 2");
  });

  it("runs all migrations when user version is unset", async () => {
    await migrate(mockDb, migrations);

    expect(mockWithTransactionAsync).toHaveBeenCalledTimes(5);

    expect(mockUp1).toHaveBeenCalledWith(mockDb);
    expect(mockUp2).toHaveBeenCalledWith(mockDb);
    expect(mockUp3).toHaveBeenCalledWith(mockDb);
    expect(mockUp4).toHaveBeenCalledWith(mockDb);
    expect(mockUp5).toHaveBeenCalledWith(mockDb);

    expect(mockExecAsync).toHaveBeenCalledWith("PRAGMA user_version = 5");
  });

  it("runs only pending migrations when user DB version is out of date", async () => {
    mockGetFirstAsync.mockReturnValueOnce({ user_version: 2 });

    await migrate(mockDb, migrations);

    expect(mockWithTransactionAsync).toHaveBeenCalledTimes(3);

    expect(mockUp1).not.toHaveBeenCalled();
    expect(mockUp2).not.toHaveBeenCalled();
    expect(mockUp3).toHaveBeenCalledWith(mockDb);
    expect(mockUp4).toHaveBeenCalledWith(mockDb);
    expect(mockUp5).toHaveBeenCalledWith(mockDb);

    expect(mockExecAsync).toHaveBeenCalledWith("PRAGMA user_version = 5");
  });
});
