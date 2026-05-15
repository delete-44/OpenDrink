import { migrate } from "@/db/migrate";
import { StorageProvider } from "@/src/context/StorageContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
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
    <SQLiteProvider databaseName="drinking_app.db" onInit={migrate}>
      <StorageProvider>
        <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
          <Stack.Screen name="index" />
        </Stack>
        <StatusBar barStyle="light-content" />
      </StorageProvider>
    </SQLiteProvider>
  );
}
