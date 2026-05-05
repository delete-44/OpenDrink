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
import { useContext } from "react";
import SVG from "./SVG";

export default function DeckSelector() {
  const { selectedDeck, isLoading } = useContext(StorageContext);

  if (isLoading) {
    return (
      <ActivityIndicator color="#fff" accessibilityLabel="Loading decks" />
    );
  }

  return (
    <View style={styles.deckSelector}>
      <View style={styles.logoBackground}>
        <Image source={require("../assets/icons/deck.png")} alt="" />
      </View>

      <Text style={globalStyles.textLg}>{selectedDeck.name}</Text>

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
          onPress={() => alert("Pressed New")}
        >
          <SVG icon={plus} width={24} height={24} />
          <Text style={globalStyles.buttonText}>New Deck</Text>
        </Pressable>
      </View>
    </View>
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
  },
});
