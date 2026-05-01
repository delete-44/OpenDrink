import { View } from "react-native";

import globalStyles from "@/assets/global-styles";
import WrappedTextInput from "@/components/WrappedTextInput";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Form() {
  const [newCard, setNewCard] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { idx } = useLocalSearchParams<{ idx: string }>();

  return (
    <SafeAreaView style={globalStyles.backgroundGradient}>
      <View>
        <WrappedTextInput
          label="Add Card"
          value={newCard}
          errorMessage={errorMessage}
          onChange={(text) => {
            setErrorMessage("");
            setNewCard(text);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
