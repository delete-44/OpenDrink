import { Pressable, StyleSheet, Text, View } from "react-native";

import globalStyles from "@/assets/global-styles";
import { SPACING_SM } from "@/assets/style-constants";
import { StorageContext } from "@/context/StorageContext";
import { useCallback, useContext } from "react";

type PlayerListItemProps = {
  name: string;
};

export default function PlayerListItem({ name }: PlayerListItemProps) {
  const { players, savePlayers } = useContext(StorageContext);

  const removePlayer = useCallback(
    (player: string) => {
      const newPlayers = [...players];
      const idx = newPlayers.indexOf(player);

      if (idx === -1) {
        // TODO: Error state
        console.warn("Could not remove player");

        return;
      }

      newPlayers.splice(idx, 1);
      savePlayers(newPlayers);
    },
    [players, savePlayers],
  );

  return (
    <View style={styles.playerListItemWrapper}>
      <Text style={globalStyles.textLg}>{name}</Text>
      <Pressable
        role="button"
        accessibilityLabel="Remove Player"
        style={globalStyles.buttonSm}
        onPress={() => removePlayer(name)}
      >
        <Text style={globalStyles.buttonText}>x</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  playerListItemWrapper: {
    flexDirection: "row",
    gap: SPACING_SM,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginVertical: 4,
  },
});
