import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import globalStyles from "@/assets/global-styles";
import { pencil } from "@/assets/icons/pencil";
import { plus } from "@/assets/icons/plus";
import { StorageContext } from "@/context/StorageContext";
import {
  CONTENT_BACKDROP,
  CONTENT_COLOR,
  SPACING_MD,
  SPACING_SM,
} from "@/src/constants/style-constants";
import { router } from "expo-router";
import { useContext, useState } from "react";
import ModalContainer from "./ModalContainer";
import SVG from "./SVG";

export default function DeckSelector() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { selectedDeck, decks, createDeck, isLoading } =
    useContext(StorageContext);

  if (isLoading) {
    return (
      <ActivityIndicator color="#fff" accessibilityLabel="Loading decks" />
    );
  }

  return (
    <>
      <View style={styles.deckSelector}>
        <View style={styles.logoBackground}>
          <Image source={require("../assets/icons/deck.png")} alt="" />
        </View>

        {/* TODO: Add dropdown caret? Or other icon to indicate interactivity */}
        <Pressable
          style={globalStyles.buttonHighlight}
          role="button"
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={globalStyles.buttonText}>{selectedDeck.name}</Text>
        </Pressable>

        <View style={styles.deckSelectorActions}>
          <Pressable
            role="button"
            style={globalStyles.buttonSm}
            onPress={() =>
              router.navigate({
                pathname: "/decks/[id]/edit",
                params: { id: selectedDeck.id },
              })
            }
          >
            <SVG icon={pencil} width={24} height={24} />
            <Text style={globalStyles.buttonText}>Edit Deck</Text>
          </Pressable>

          <Pressable
            role="button"
            style={globalStyles.buttonSm}
            onPress={async () => {
              const newDeck = await createDeck();

              router.navigate({
                pathname: "/decks/[id]/edit",
                params: { id: newDeck.id },
              });
            }}
          >
            <SVG icon={plus} width={24} height={24} />
            <Text style={globalStyles.buttonText}>New Deck</Text>
          </Pressable>
        </View>
      </View>

      <ModalContainer
        title="Select Deck"
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      >
        {/* TODO: Use a list, add interactivity */}
        {(decks || []).map((deck) => (
          <Text key={deck.id} style={globalStyles.textLg}>
            {deck.name || "Untitled Deck"}
          </Text>
        ))}
      </ModalContainer>
    </>
  );
}

const styles = StyleSheet.create({
  logoBackground: {
    backgroundColor: CONTENT_COLOR,
    borderRadius: 99,
    padding: SPACING_MD,
  },
  deckSelector: {
    padding: SPACING_MD,
    marginInline: "auto",

    backgroundColor: CONTENT_BACKDROP,
    borderRadius: SPACING_SM,

    flexDirection: "column",
    alignItems: "center",
    gap: SPACING_SM,
  },
  deckSelectorActions: {
    flexDirection: "row",
    gap: SPACING_SM,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
