import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import globalStyles from "@/assets/global-styles";
import {
  CONTENT_BACKDROP,
  CONTENT_COLOR,
  SPACING_MD,
  SPACING_SM,
} from "@/assets/style-constants";

export default function DeckSelector() {
  return (
    <View style={styles.deckSelector}>
      <View style={styles.logoBackground}>
        <Image
          style={styles.logo}
          source={require("../assets/icons/deck.png")}
          alt=""
        />
      </View>
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
  logoBackground: {
    backgroundColor: CONTENT_COLOR,
    borderRadius: 99,
    padding: SPACING_MD,
  },
  logo: {},
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
