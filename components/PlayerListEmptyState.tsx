import globalStyles from "@/assets/global-styles";
import { SPACING_MD, SPACING_SM } from "@/src/constants/style-constants";
import { Image, StyleSheet, Text, View } from "react-native";

export default function PlayerListEmptyState() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/images/decorative/arrow-up.png")}
        alt=""
      />
      <Text style={globalStyles.textMd}>Add players here!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    padding: SPACING_MD,
    gap: SPACING_SM,
  },
  image: {
    width: 50,
    height: 150,
    resizeMode: "contain",
  },
});
