# SQLite Setup

## Initialisation

`./migrate.ts` runs on app initialisation. This is configured in the `app/_layout.tsx` SQLiteProvider.

This will:

- Fetch the version of the DB the user is running (using [PRAGMA user_version](https://sqlite.org/pragma.html#pragma_user_version))
- Run any pending migrations (any that occur after the stored `user_version`)
- Set the `user_version` to the index of the latest migration

## Migrations

Migrations are stored in `./migrations` and must be of type `./TDataBaseMigration.ts`

- `name` is a human-friendly name, used in logging
- `up` is the DB query to perform the DB change. This is executed in a transaction

### Adding Migrations

1. Create the migration file under `./migrations`. These should be numbered sequentially
1. Add the migration to the collective export in `./migrations/index.ts`
1. This will now be run on initialisation

## Seeding data

// TODO

## Running queries in code

// TODO

## Debugging

Expo SDK 55 ships with a debugger built-in :tada:

- Start the development server with `npx expo start`
- Press `shift+M` to open additional options
- `Open expo-sqlite` will open a browser window where you can view, inspect, and interact with the data
