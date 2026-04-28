import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import globalStyles from "@/assets/global-styles";
import {
  CONTENT_BACKDROP,
  SPACING_MD,
  SPACING_SM,
} from "@/assets/style-constants";
import { StorageContext } from "@/context/StorageContext";
import { useCallback, useContext, useState } from "react";
import PlayerListEmptyState from "./PlayerListEmptyState";
import PlayerListItem from "./PlayerListItem";

export default function PlayerList() {
  const { players, savePlayers } = useContext(StorageContext);

  const [newPlayer, setNewPlayer] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const addPlayer = useCallback(
    (name: string) => {
      const newPlayers = [...players];

      if (!name.trim()) {
        setErrorMessage("Player name cannot be empty");
        return;
      }

      if (players.includes(name.trim())) {
        setErrorMessage("Player already exists");
        return;
      }

      newPlayers.push(name.trim());

      savePlayers(newPlayers);

      setNewPlayer("");
    },
    [players, savePlayers],
  );

  return (
    <View style={styles.playerList}>
      <View style={styles.playerInputWrapper}>
        <View style={globalStyles.formGroup}>
          <Text style={globalStyles.label} nativeID="playerNameLabel">
            Name
          </Text>

          <TextInput
            autoCorrect={false}
            aria-labelledby="playerNameLabel"
            style={globalStyles.textInput}
            value={newPlayer}
            onChangeText={(text) => {
              setErrorMessage("");
              setNewPlayer(text);
            }}
          />

          {errorMessage ? (
            <Text style={globalStyles.textDanger}>{errorMessage}</Text>
          ) : (
            // Manually setting placeholder with fixed height to prevent UI jumps
            <View style={{ height: 17 }} />
          )}
        </View>

        <Pressable
          role="button"
          accessibilityLabel="Add Player"
          style={globalStyles.buttonHighlight}
          onPress={() => addPlayer(newPlayer)}
        >
          <Text style={globalStyles.buttonText}>+</Text>
        </Pressable>
      </View>

      <FlatList
        data={players}
        renderItem={({ item }) => <PlayerListItem name={item} />}
        ListEmptyComponent={PlayerListEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  playerList: {
    maxWidth: "90%",
    paddingHorizontal: SPACING_MD,
    paddingVertical: SPACING_SM,
    marginInline: "auto",
    flex: 1,

    backgroundColor: CONTENT_BACKDROP,
    borderRadius: SPACING_SM,

    flexDirection: "column",
    alignItems: "center",
    gap: SPACING_MD,
  },
  playerInputWrapper: {
    flexDirection: "row",
    gap: SPACING_SM,
    justifyContent: "space-between",
    alignItems: "baseline",
  },
});
