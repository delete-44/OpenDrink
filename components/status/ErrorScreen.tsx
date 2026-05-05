import globalStyles from "@/assets/global-styles";
import { SPACING_LG } from "@/src/constants/style-constants";
import { router } from "expo-router";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ErrorScreenProps = {
  message: string;
};

export default function ErrorScreen({ message }: ErrorScreenProps) {
  return (
    <SafeAreaView
      style={[globalStyles.backgroundGradient, { padding: SPACING_LG }]}
    >
      <Text style={globalStyles.textLg}>Error: {message}</Text>

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
