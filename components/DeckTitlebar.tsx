import globalStyles from "@/assets/global-styles";
import { check } from "@/assets/icons/check";
import { pencil } from "@/assets/icons/pencil";
import { StorageContext } from "@/context/StorageContext";
import {
  DECORATION_COLOR,
  FORM_CONTROL_SIZE,
  FORM_LABEL_HEIGHT,
  SPACING_LG,
  SPACING_SM,
} from "@/src/constants/style-constants";
import { Deck } from "@/src/models/Deck";
import { useCallback, useContext, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  ViewStyle,
} from "react-native";
import SVG from "./SVG";
import WrappedTextInput from "./WrappedTextInput";

type DeckTitlebarProps = {
  currentDeck: Deck;
};

export default function DeckTitlebar({ currentDeck }: DeckTitlebarProps) {
  const { saveDeck } = useContext(StorageContext);

  const [editingDeckName, setEditingDeckName] = useState(
    currentDeck.name === "",
  );

  const [workingDeckName, setWorkingDeckName] = useState(currentDeck.name);
  const [deckNameErrorMessage, setDeckNameErrorMessage] = useState("");

  const updateDeckName = useCallback(
    (name: string) => {
      if (name.trim() === "") {
        setDeckNameErrorMessage("Deck name cannot be empty");

        return;
      }

      const updatedDeck = new Deck(
        name.trim(),
        [...currentDeck.cards],
        currentDeck.id,
      );

      saveDeck(currentDeck.id, updatedDeck);
      setEditingDeckName(false);

      ToastAndroid.show("Name Saved", ToastAndroid.SHORT);
    },
    [currentDeck, saveDeck],
  );

  if (editingDeckName) {
    return (
      <View style={styles.deckNameWrapper} role="form">
        <WrappedTextInput
          label="Deck Name"
          value={workingDeckName}
          errorMessage={deckNameErrorMessage}
          onChange={(text) => {
            setDeckNameErrorMessage("");
            setWorkingDeckName(text);
          }}
          autofocus
        />

        <Pressable
          role="button"
          style={styles.confirmButton}
          accessibilityLabel="Confirm Change"
          onPress={() => updateDeckName(workingDeckName)}
        >
          <SVG icon={check} width={24} height={24} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.actionsWrapper}>
      <Text style={[globalStyles.textLg, { flex: 1 }]}>{currentDeck.name}</Text>

      <Pressable
        role="button"
        accessibilityLabel="Rename Deck"
        style={globalStyles.buttonSm}
        onPress={() => setEditingDeckName(true)}
      >
        <SVG icon={pencil} width={24} height={24} />
      </Pressable>
    </View>
  );
}

const baseTitlebar = {
  padding: SPACING_LG,
  flexDirection: "row",
  gap: SPACING_SM,

  borderBottomColor: DECORATION_COLOR,
  borderBottomWidth: 5,
} as ViewStyle;

const styles = StyleSheet.create({
  actionsWrapper: {
    ...baseTitlebar,
    alignItems: "center",
  },
  deckNameWrapper: {
    ...baseTitlebar,
    alignItems: "flex-end",
    paddingBottom: SPACING_LG - FORM_LABEL_HEIGHT,
  },
  confirmButton: {
    ...globalStyles.buttonHighlight,
    marginBottom: FORM_LABEL_HEIGHT,
    height: FORM_CONTROL_SIZE,
  },
});
