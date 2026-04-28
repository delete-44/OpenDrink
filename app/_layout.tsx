import { StorageProvider } from "@/context/StorageContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "react-native";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    JockeyOne: require("../assets/fonts/JockeyOne-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <StorageProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />
    </StorageProvider>
  );
}
