import globalStyles from "@/assets/global-styles";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

export default function PlayerListEmptyState() {
  return (
    <View style={styles.container}>
      <Image
        alt=""
        style={styles.image}
        source={require("../../../assets/images/decorative/arrow-short.png")}
        contentFit="contain"
        allowDownscaling
      />
      <Text style={globalStyles.textMd}>Add Players here!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
  },
  image: {
    width: 48,
    height: 128,
  },
});
