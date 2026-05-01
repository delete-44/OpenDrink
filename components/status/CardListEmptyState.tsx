import globalStyles from "@/assets/global-styles";
import DEFAULT_DECK from "@/src/constants/default-deck";
import { SPACING_MD, SPACING_SM } from "@/src/constants/style-constants";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type CardListEmptyStateProps = {
  addCards: (cards: string[]) => void;
};

export default function CardListEmptyState({
  addCards,
}: CardListEmptyStateProps) {
  return (
    <View style={styles.container}>
      <Pressable
        role="button"
        style={globalStyles.button}
        onPress={() => {
          addCards(DEFAULT_DECK.cards);
        }}
      >
        <Text style={globalStyles.buttonText}>Load Default Cards</Text>
      </Pressable>

      <Text style={globalStyles.textMd}>... or add your own here!</Text>

      <Image
        style={styles.image}
        source={require("../../assets/images/decorative/arrow-up.png")}
        alt=""
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
    width: 50,
    height: 250,
    resizeMode: "contain",
    transform: "rotate(180deg)",
  },
});
