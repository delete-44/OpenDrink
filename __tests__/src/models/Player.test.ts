import { PlayerFactory } from "@/factories/models/PlayerFactory";
import { Player } from "@/src/models/Player";
import { TPlayerData } from "@/src/types";

describe("Player", () => {
  describe("#toJson", () => {
    it("converts a Player to a JSON object", () => {
      const player = PlayerFactory();

      expect(player.toJson()).toEqual({
        id: player.id,
        name: player.name,
        created_at: player.created_at,
        updated_at: player.updated_at,
      });
    });
  });

  describe("#fromJson", () => {
    it("generates a Player from a JSON object", () => {
      const playerData = {
        id: 2,
        name: "Sally",
        created_at: "1970-01-01",
        updated_at: "1970-01-02",
      } as TPlayerData;

      const player = Player.fromJson(playerData);

      expect(player.id).toEqual(2);
      expect(player.name).toEqual("Sally");
      expect(player.created_at).toEqual("1970-01-01");
      expect(player.updated_at).toEqual("1970-01-02");
    });
  });
});
