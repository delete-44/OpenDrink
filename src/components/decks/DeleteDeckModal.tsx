import globalStyles from "@/assets/global-styles";
import { SPACING_LG, SPACING_SM } from "@/src/constants/style-constants";
import { StorageContext } from "@/src/context/StorageContext";
import { Deck } from "@/src/models/Deck";
import { router } from "expo-router";
import { useCallback, useContext, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../Button";
import ModalContainer from "../ModalContainer";

type DeleteDeckModalProps = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  deck: Deck;
};

export default function DeleteDeckModal({
  isVisible,
  setIsVisible,
  deck,
}: DeleteDeckModalProps) {
  const { destroyDeck, saveSelectedDeckIdx } = useContext(StorageContext);

  const isProcessing = useRef(false);

  const deleteDeck = useCallback(
    async (id: number) => {
      if (isProcessing.current) return;
      isProcessing.current = true;

      try {
        // Optimistically navigate away
        await saveSelectedDeckIdx(0);
        setIsVisible(false);
        router.back();

        await destroyDeck(id);
      } catch (e: any) {
        // TODO Error handling shown to user
        console.error(e);

        // If destroy fails, navigate back here
        router.navigate({ pathname: "/decks/[id]/edit", params: { id } });
      } finally {
        isProcessing.current = false;
      }
    },
    [destroyDeck, saveSelectedDeckIdx, setIsVisible],
  );

  return (
    <ModalContainer
      title="Delete Deck"
      isVisible={isVisible}
      onClose={() => setIsVisible(false)}
    >
      <View style={styles.modalBody}>
        <Text style={globalStyles.textLg}>
          This will delete the deck: &quot;{deck.name}&quot;.
        </Text>

        <Text style={globalStyles.textLg}>
          This action is irreversible. Are you sure you want to continue?
        </Text>

        <View style={styles.modalFooter}>
          <Button onPress={() => setIsVisible(false)}>
            <Text style={globalStyles.buttonText}>Cancel</Text>
          </Button>

          <Button type="danger" onPress={() => deleteDeck(deck.id)}>
            <Text style={globalStyles.buttonText}>Delete Deck</Text>
          </Button>
        </View>
      </View>
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  modalBody: {
    padding: SPACING_SM,
    gap: SPACING_LG,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: SPACING_SM,
  },
});
