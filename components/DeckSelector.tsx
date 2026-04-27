import { Pressable, StyleSheet, Text, View } from "react-native";

import globalStyles, {
  CONTENT_BACKDROP,
  SPACING_MD,
  SPACING_SM,
} from "@/assets/global-styles";

export default function DeckSelector() {
  return (
    <View style={styles.deckSelector}>
      <Text style={globalStyles.textLg}>Default</Text>

      <View style={styles.deckSelectorActions}>
        <Pressable
          role="button"
          style={globalStyles.button}
          onPress={() => alert("Pressed Edit")}
        >
          <Text style={globalStyles.buttonText}>Edit</Text>
        </Pressable>
        <Pressable
          role="button"
          style={globalStyles.button}
          onPress={() => alert("Pressed New")}
        >
          <Text style={globalStyles.buttonText}>New</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  deckSelector: {
    padding: SPACING_MD,
    marginInline: "auto",

    backgroundColor: CONTENT_BACKDROP,
    borderRadius: SPACING_SM,

    flexDirection: "column",
    alignItems: "center",
    gap: SPACING_MD,
  },
  deckSelectorActions: {
    flexDirection: "row",
    gap: SPACING_MD,
    justifyContent: "space-between",
  },
});
