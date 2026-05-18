import { Player } from "@/src/models/Player";
import { TPlayerData } from "@/src/types";

export function PlayerFactory(overrides: Partial<TPlayerData> = {}) {
  return new Player({
    id: 1,
    name: "Test Player",
    created_at: "1970-01-01",
    updated_at: "1970-01-02",
    ...overrides,
  });
}
