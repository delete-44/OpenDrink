import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import globalStyles from "@/assets/global-styles";
import { plus } from "@/assets/icons/plus";
import {
  CONTENT_BACKDROP,
  FORM_CONTROL_SIZE,
  FORM_LABEL_HEIGHT,
  SPACING_LG,
  SPACING_MD,
  SPACING_SM,
} from "@/src/constants/style-constants";
import { StorageContext } from "@/src/context/StorageContext";
import { useCallback, useContext, useState } from "react";
import HorizontalDivider from "./HorizontalDivider";
import RemovableListItem from "./RemovableListItem";
import PlayerListEmptyState from "./status/PlayerListEmptyState";
import SVG from "./SVG";
import WrappedTextInput from "./WrappedTextInput";

export default function PlayerList() {
  const { players, createPlayer, deletePlayer, isLoading } =
    useContext(StorageContext);

  const [newPlayer, setNewPlayer] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const addPlayer = useCallback(
    async (name: string) => {
      try {
        await createPlayer({ name });
        setNewPlayer("");
      } catch (e: any) {
        setErrorMessage(e.message);
      }
    },
    [createPlayer],
  );

  const removePlayer = useCallback(
    async (playerId: number) => {
      try {
        await deletePlayer(playerId);
      } catch (e: any) {
        setErrorMessage(e.message);
      }
    },
    [deletePlayer],
  );

  return (
    <View style={styles.playerList}>
      <View style={styles.playerInputWrapper} role="form">
        <WrappedTextInput
          label="Name"
          value={newPlayer}
          errorMessage={errorMessage}
          submitBehaviour="submit"
          onSubmit={() => addPlayer(newPlayer)}
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
        renderItem={({ item }) => (
          <RemovableListItem
            label={item.name}
            removeItemCb={() => removePlayer(item.id)}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator
              color="#fff"
              accessibilityLabel="Loading Players"
            />
          ) : (
            PlayerListEmptyState
          )
        }
        ItemSeparatorComponent={HorizontalDivider}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  playerList: {
    paddingHorizontal: SPACING_MD,
    paddingVertical: SPACING_SM,
    marginInline: SPACING_LG,
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
    marginTop: SPACING_LG,
  },
  addPlayerButton: {
    ...globalStyles.buttonHighlight,
    marginBottom: FORM_LABEL_HEIGHT,
    height: FORM_CONTROL_SIZE,
  },
});
