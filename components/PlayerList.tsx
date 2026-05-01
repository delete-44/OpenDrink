import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import globalStyles from "@/assets/global-styles";
import { plus } from "@/assets/icons/plus";
import { StorageContext } from "@/context/StorageContext";
import {
  CONTENT_BACKDROP,
  FORM_CONTROL_SIZE,
  FORM_LABEL_HEIGHT,
  SPACING_LG,
  SPACING_MD,
  SPACING_SM,
} from "@/src/constants/style-constants";
import { useCallback, useContext, useState } from "react";
import PlayerListEmptyState from "./PlayerListEmptyState";
import PlayerListItem from "./PlayerListItem";
import SVG from "./SVG";
import WrappedTextInput from "./WrappedTextInput";

export default function PlayerList() {
  const { players, savePlayers, isLoading } = useContext(StorageContext);

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
        <WrappedTextInput
          label="Name"
          value={newPlayer}
          errorMessage={errorMessage}
          onChange={(text) => {
            setErrorMessage("");
            setNewPlayer(text);
          }}
        />

        <Pressable
          role="button"
          accessibilityLabel="Add Player"
          style={styles.addPlayerButton}
          onPress={() => addPlayer(newPlayer)}
        >
          <SVG icon={plus} width={24} height={24} />
        </Pressable>
      </View>

      <FlatList
        data={players}
        renderItem={({ item }) => <PlayerListItem name={item} />}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator
              color="#fff"
              accessibilityLabel="Loading players"
            />
          ) : (
            PlayerListEmptyState
          )
        }
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
  },
  playerInputWrapper: {
    gap: SPACING_SM,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: "auto",
    marginTop: SPACING_LG,
  },
  addPlayerButton: {
    ...globalStyles.buttonHighlight,
    marginBottom: FORM_LABEL_HEIGHT,
    height: FORM_CONTROL_SIZE,
  },
});
