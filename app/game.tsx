import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import globalStyles from "@/assets/global-styles";
import { StorageContext } from "@/context/StorageContext";
import { SPACING_LG, SPACING_MD } from "@/src/constants/style-constants";
import { Game } from "@/src/models/Game";
import { GameState } from "@/src/types";
import { useKeepAwake } from "expo-keep-awake";
import { router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GameScreen() {
  useKeepAwake();

  const { currentDeck, players, isLoading } = useContext(StorageContext);

  const [game, setGame] = useState<Game>();
  const [currentCard, setCurrentCard] = useState<GameState>();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (isLoading) return;

    try {
      const newGame = new Game(currentDeck, players);
      setGame(newGame);
      setCurrentCard(newGame.drawCard());
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  }, [isLoading, currentDeck, players]);

  // Loading screen
  if (isLoading) {
    return (
      <SafeAreaView style={globalStyles.backgroundGradient}>
        <ActivityIndicator color="#fff" accessibilityLabel="Loading game" />
      </SafeAreaView>
    );
  }

  // Error screen
  if (!game || !currentCard || errorMessage) {
    return (
      <SafeAreaView
        style={{ ...globalStyles.backgroundGradient, padding: SPACING_LG }}
      >
        <Text style={globalStyles.textLg}>
          Error: {errorMessage || "Game not properly initialized"}
        </Text>

        <Pressable
          onPress={() => router.back()}
          style={globalStyles.button}
          role="button"
        >
          <Text style={globalStyles.buttonText}>Back to Home</Text>
        </Pressable>
      </SafeAreaView>
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
        accessibilityLabel="Tap to draw next card"
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
