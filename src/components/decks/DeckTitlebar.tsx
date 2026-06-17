import globalStyles from "@/assets/global-styles";
import { check } from "@/assets/icons/check";
import { cross } from "@/assets/icons/cross";
import { pencil } from "@/assets/icons/pencil";
import {
  DECORATION_COLOR,
  FORM_CONTROL_SIZE,
  FORM_LABEL_HEIGHT,
  SPACING_LG,
  SPACING_SM,
} from "@/src/constants/style-constants";
import { Deck } from "@/src/models/Deck";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import Button from "../Button";
import SVG from "../SVG";
import WrappedTextInput from "../WrappedTextInput";
import DeleteDeckModal from "./DeleteDeckModal";

type DeckTitlebarProps = {
  deck: Deck;
  saveDeckCallback: (name: string) => Promise<void>;
};

export default function DeckTitlebar({
  deck,
  saveDeckCallback,
}: DeckTitlebarProps) {
  const [editingDeckName, setEditingDeckName] = useState(deck.name === "");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [workingDeckName, setWorkingDeckName] = useState(deck.name);
  const [deckNameErrorMessage, setDeckNameErrorMessage] = useState("");

  const updateDeckName = useCallback(
    async (name: string) => {
      try {
        await saveDeckCallback(name);
        setEditingDeckName(false);
      } catch (e: any) {
        console.error(e);

        setDeckNameErrorMessage(e.message);
      }
    },
    [saveDeckCallback],
  );

  if (editingDeckName) {
    return (
      <View style={styles.activeStateWrapper} role="form">
        <WrappedTextInput
          label="Deck Name"
          value={workingDeckName}
          errorMessage={deckNameErrorMessage}
          submitBehaviour="blurAndSubmit"
          onSubmit={() => updateDeckName(workingDeckName)}
          onChange={(text) => {
            setDeckNameErrorMessage("");
            setWorkingDeckName(text);
          }}
          autofocus
        />

        <Button
          type="highlight"
          additionalStyle={styles.confirmButton}
          accessibilityLabel="Confirm Change"
          onPress={() => updateDeckName(workingDeckName)}
        >
          <SVG icon={check} width={24} height={24} />
        </Button>
      </View>
    );
  }

  return (
    <>
      <View style={styles.inertStateWrapper}>
        <Text style={[globalStyles.textLg, { flex: 1 }]}>{deck.name}</Text>

        <Button
          accessibilityLabel="Rename Deck"
          onPress={() => setEditingDeckName(true)}
        >
          <SVG icon={pencil} width={24} height={24} />
        </Button>

        <Button
          type="danger"
          accessibilityLabel="Delete Deck"
          onPress={() => setIsDeleteModalVisible(true)}
        >
          <SVG icon={cross} width={24} height={24} />
        </Button>
      </View>

      {isDeleteModalVisible && (
        <DeleteDeckModal
          isVisible={isDeleteModalVisible}
          setIsVisible={setIsDeleteModalVisible}
          deck={deck}
        />
      )}
    </>
  );
}

const baseTitlebar = {
  paddingHorizontal: SPACING_LG,
  flexDirection: "row",
  gap: SPACING_SM,

  borderBottomColor: DECORATION_COLOR,
  borderBottomWidth: 5,
} as ViewStyle;

const styles = StyleSheet.create({
  inertStateWrapper: {
    ...baseTitlebar,
    alignItems: "center",
    paddingVertical: SPACING_LG,
  },
  activeStateWrapper: {
    ...baseTitlebar,
    alignItems: "flex-end",
  },
  confirmButton: {
    marginBottom: FORM_LABEL_HEIGHT + 1.5, // Pixel-perfect tweaks to align this with inert-state buttons
    height: FORM_CONTROL_SIZE,
  },
});
