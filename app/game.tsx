import { Pressable, StyleSheet, Text, View } from "react-native";

import globalStyles from "@/assets/global-styles";
import { StorageContext } from "@/context/StorageContext";
import { SPACING_MD } from "@/src/constants/style-constants";
import { Game } from "@/src/models/Game";
import { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GameScreen() {
  const { currentDeck, players } = useContext(StorageContext);
  const [game] = useState(new Game(currentDeck, players));
  const [currentCard, setCurrentCard] = useState(game.drawCard());

  return (
    <SafeAreaView style={globalStyles.rootBg}>
      <Pressable
        style={styles.buttonWrapper}
        onPress={() => {
          setCurrentCard(game.drawCard());
        }}
      >
        <Text style={{ ...globalStyles.textLg, ...styles.screenTextMixin }}>
          {currentCard.player}&apos;s Turn
        </Text>
        <View style={styles.cardWrapper}>
          <Text style={{ ...globalStyles.textHero, ...styles.screenTextMixin }}>
            {currentCard.card}
          </Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    flex: 1,
    alignItems: "center",
    padding: SPACING_MD,
  },
  screenTextMixin: {
    textAlign: "center",
  },
  cardWrapper: {
    flex: 1,
    justifyContent: "center",
  },
});
