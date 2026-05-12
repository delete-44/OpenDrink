import { CONTENT_COLOR, SPACING_MD } from "@/src/constants/style-constants";
import { Image, StyleSheet, View } from "react-native";

export default function Logo() {
  return (
    <View style={styles.logoBackground}>
      <Image source={require("../assets/icons/deck.png")} alt="" role="img" />
    </View>
  );
}

const styles = StyleSheet.create({
  logoBackground: {
    backgroundColor: CONTENT_COLOR,
    borderRadius: 99,
    padding: SPACING_MD,
  },
});
