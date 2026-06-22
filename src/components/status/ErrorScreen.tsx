import globalStyles from "@/assets/global-styles";
import { SPACING_LG } from "@/src/constants/style-constants";
import { router } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../Button";

type ErrorScreenProps = {
  message: string;
};

export default function ErrorScreen({ message }: ErrorScreenProps) {
  return (
    <SafeAreaView
      style={[globalStyles.backgroundGradient, { padding: SPACING_LG }]}
    >
      <Text style={globalStyles.textLg}>Error: {message}</Text>

      <Button onPress={() => router.back()}>
        <Text style={globalStyles.buttonText}>Back to Home</Text>
      </Button>
    </SafeAreaView>
  );
}
