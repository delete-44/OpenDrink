import {
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
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={{ ...globalStyles.rootBg, gap: SPACING_MD }}>
      <DeckSelector />

      <PlayerList />

      <KeyboardAvoidingView behavior="padding">
        <View style={styles.heroButtonWrapper}>
          <Pressable
            role="button"
            accessibilityLabel="Remove Player"
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
