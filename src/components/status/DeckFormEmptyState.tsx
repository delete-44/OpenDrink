import globalStyles from "@/assets/global-styles";
import { SPACING_MD, SPACING_SM } from "@/src/constants/style-constants";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

export default function DeckFormEmptyState() {
  return (
    <View style={styles.container}>
      <Image
        alt=""
        style={styles.image}
        source={require("../../../assets/images/decorative/arrow-short.png")}
        contentFit="contain"
        allowDownscaling
      />

      <Text style={globalStyles.textMd}>Give your Deck a name</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    padding: SPACING_MD,
    gap: SPACING_SM,
    overflow: "hidden",
    flex: 1,
  },
  image: {
    width: 48,
    height: 128,
  },
});
