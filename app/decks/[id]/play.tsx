import { Pressable, StyleSheet, Text, View } from "react-native";

import globalStyles from "@/assets/global-styles";
import ErrorScreen from "@/src/components/status/ErrorScreen";
import LoadingScreen from "@/src/components/status/LoadingScreen";
import { SPACING_LG } from "@/src/constants/style-constants";
import { CardContext } from "@/src/context/CardContext";
import { StorageContext } from "@/src/context/StorageContext";
import { Game } from "@/src/models/Game";
import { GameState } from "@/src/types";
import { useKeepAwake } from "expo-keep-awake";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Play() {
  useKeepAwake();

  const { players, isLoading: isStorageContextLoading } =
    useContext(StorageContext);
  const { cards, isLoading: isCardContextLoading } = useContext(CardContext);

  const [game, setGame] = useState<Game>();
  const [gameState, setGameState] = useState<GameState>();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    try {
      if (isStorageContextLoading || isCardContextLoading) {
        return;
      }

      const newGame = new Game(cards, players);
      setGame(newGame);
      setGameState(newGame.drawCard());
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  }, [cards, isCardContextLoading, isStorageContextLoading, players]);

  // Loading screen
  if (isStorageContextLoading || isCardContextLoading) {
    return <LoadingScreen label={"Loading Game"} />;
  }

  // Error screen
  if (!game || !gameState || errorMessage) {
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
          setGameState(game.drawCard());
        }}
        role="button"
        accessibilityLabel="Tap to draw next Card"
      >
        <Text
          style={[
            globalStyles.textLg,
            styles.screenTextMixin,
            { textDecorationLine: "underline" },
          ]}
        >
          {gameState.player.name}&apos;s Turn
        </Text>
        <View style={styles.cardWrapper}>
          <Text style={[globalStyles.textHero, styles.screenTextMixin]}>
            {gameState.card.content}
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
    padding: SPACING_LG,
  },
  screenTextMixin: {
    textAlign: "center",
  },
  cardWrapper: {
    flex: 1,
    justifyContent: "center",
  },
});
