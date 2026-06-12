import globalStyles from "@/assets/global-styles";
import { DEFAULT_CARDS } from "@/src/constants/default-deck";
import { SPACING_MD, SPACING_SM } from "@/src/constants/style-constants";
import { CardPermittedFields } from "@/src/repositories/CardRepository";
import { Image } from "expo-image";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type CardListEmptyStateProps = {
  addCards: (cards: CardPermittedFields[]) => void;
};

export default function CardListEmptyState({
  addCards,
}: CardListEmptyStateProps) {
  const [isActive, setIsActive] = useState(false);

  if (isActive) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#fff" accessibilityLabel="Loading Cards" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        role="button"
        style={globalStyles.button}
        onPress={() => {
          setIsActive(true);
          addCards(DEFAULT_CARDS);
        }}
      >
        <Text style={globalStyles.buttonText}>Load Default Cards</Text>
      </Pressable>

      <Text style={globalStyles.textMd}>... or add your own here!</Text>

      <Image
        alt=""
        style={styles.image}
        source={require("../../../assets/images/decorative/arrow-long.png")}
        contentFit="contain"
        allowDownscaling
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING_MD,
    gap: SPACING_SM,
  },
  image: {
    height: 384,
    width: 69,
    transform: [{ rotate: "180deg" }],
  },
});
