import globalStyles from "@/assets/global-styles";
import { check } from "@/assets/icons/check";
import { pencil } from "@/assets/icons/pencil";
import {
  DECORATION_COLOR,
  FORM_CONTROL_SIZE,
  FORM_LABEL_HEIGHT,
  SPACING_LG,
  SPACING_SM,
} from "@/src/constants/style-constants";
import { Deck } from "@/src/models/Deck";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import SVG from "./SVG";
import WrappedTextInput from "./WrappedTextInput";

type DeckTitlebarProps = {
  currentDeck: Deck;
};

export default function DeckTitlebar({ currentDeck }: DeckTitlebarProps) {
  const [editingDeckName, setEditingDeckName] = useState(
    currentDeck.name === "",
  );
  const [workingDeckName, setWorkingDeckName] = useState(currentDeck.name);

  if (editingDeckName) {
    return (
      <View style={styles.deckNameWrapper} role="form">
        <WrappedTextInput
          label="Deck Name"
          value={workingDeckName}
          errorMessage={""} // TODO: Error handling
          onChange={(text) => {
            setWorkingDeckName(text);
          }}
          autofocus={currentDeck.name === ""}
        />

        <Pressable
          role="button"
          style={styles.confirmButton}
          accessibilityLabel="Confirm Change"
          onPress={() => setEditingDeckName(false)} // TODO: And save deck
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
