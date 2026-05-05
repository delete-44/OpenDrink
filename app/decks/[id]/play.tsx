import { Pressable, StyleSheet, Text, View } from "react-native";

import globalStyles from "@/assets/global-styles";
import ErrorScreen from "@/components/status/ErrorScreen";
import { useDeckFromLayout } from "@/context/DeckLayoutContext";
import { StorageContext } from "@/context/StorageContext";
import { SPACING_MD } from "@/src/constants/style-constants";
import { Game } from "@/src/models/Game";
import { GameState } from "@/src/types";
import { useKeepAwake } from "expo-keep-awake";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Play() {
  useKeepAwake();

  const { players, isLoading } = useContext(StorageContext);

  const [game, setGame] = useState<Game>();
  const [currentCard, setCurrentCard] = useState<GameState>();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const currentDeck = useDeckFromLayout();

  useEffect(() => {
    try {
      const newGame = new Game(currentDeck, players);
      setGame(newGame);
      setCurrentCard(newGame.drawCard());
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  }, [isLoading, currentDeck, players]);

  // Error screen
  if (!game || !currentCard || errorMessage) {
    return (
      <ErrorScreen message={errorMessage || "Game not properly initialized"} />
    );
  }

  // Game
  return (
    <SafeAreaView style={globalStyles.backgroundGradient}>
      <Pressable
        style={styles.buttonWrapper}
        onPress={() => {
          setCurrentCard(game.drawCard());
        }}
        role="button"
        accessibilityLabel="Tap to draw next Card"
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
