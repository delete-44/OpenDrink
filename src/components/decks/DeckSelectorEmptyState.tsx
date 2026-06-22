import { StyleSheet, Text, View } from "react-native";

import globalStyles from "@/assets/global-styles";
import { plus } from "@/assets/icons/plus";
import {
  CONTENT_BACKDROP,
  FONT_SIZE_MD,
  SPACING_MD,
  SPACING_SM,
} from "@/src/constants/style-constants";
import { router } from "expo-router";
import Button from "../Button";
import Logo from "../Logo";
import SVG from "../SVG";

export default function DeckSelectorEmptyState() {
  return (
    <View style={styles.deckSelectorWrapper}>
      <Logo />

      <Text style={globalStyles.textMd}>Add a Deck to get started:</Text>

      <Button
        type="highlight"
        onPress={() => {
          router.navigate("/decks/new");
        }}
      >
        <SVG icon={plus} width={24} height={24} />
        <Text style={[globalStyles.buttonText, { fontSize: FONT_SIZE_MD }]}>
          New Deck
        </Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  deckSelectorWrapper: {
    padding: SPACING_MD,
    marginInline: "auto",
    maxWidth: "75%",

    backgroundColor: CONTENT_BACKDROP,
    borderRadius: SPACING_SM,

    flexDirection: "column",
    alignItems: "center",
    gap: SPACING_SM,
  },
});
