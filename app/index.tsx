import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import globalStyles from "@/assets/global-styles";
import {
  BACKGROUND_COLOR,
  DECORATION_COLOR,
  SPACING_LG,
  SPACING_MD,
  SPACING_SM,
} from "@/assets/style-constants";
import DeckSelector from "@/components/DeckSelector";
import PlayerList from "@/components/PlayerList";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
    });
    const hideListener = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{ ...globalStyles.rootBg, gap: SPACING_MD }}>
      {!isKeyboardVisible && <DeckSelector />}

      <PlayerList />

      <KeyboardAvoidingView behavior="padding">
        <View style={styles.heroButtonWrapper}>
          <Pressable
            role="button"
            style={styles.heroButton}
            onPress={() => alert("Get started clicked")}
          >
            <Text style={globalStyles.buttonText}>Get Started!</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heroButtonWrapper: {
    borderTopWidth: 5,
    borderTopColor: DECORATION_COLOR,
    backgroundColor: BACKGROUND_COLOR,
    padding: SPACING_SM,
    justifyContent: "flex-end",
  },
  heroButton: {
    ...globalStyles.buttonHighlight,
    paddingVertical: SPACING_LG,
    alignSelf: "center",
    boxShadow: `-5px 5px 0 ${DECORATION_COLOR}`,
  },
});
