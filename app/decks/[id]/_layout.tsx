import ErrorScreen from "@/src/components/status/ErrorScreen";
import LoadingScreen from "@/src/components/status/LoadingScreen";
import { CardProvider } from "@/src/context/CardContext";
import { DeckLayoutContext } from "@/src/context/DeckLayoutContext";
import { StorageContext } from "@/src/context/StorageContext";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useContext, useMemo, useState } from "react";

export default function DecksLayout() {
  const [pageLoadError, setPageLoadError] = useState("");
  const { fetchDeck, isLoading } = useContext(StorageContext);
  const { id } = useLocalSearchParams<{ id: string }>();

  const currentDeck = useMemo(() => {
    if (isLoading) return undefined;

    const loadedDeck = fetchDeck(parseInt(id));

    if (!loadedDeck?.cards) {
      setPageLoadError("Failed to load Deck.");
      return undefined;
    }

    setPageLoadError("");
    return loadedDeck;
  }, [fetchDeck, id, isLoading]);

  if (isLoading) {
    return <LoadingScreen label="Loading Deck" />;
  }

  if (pageLoadError || !currentDeck) {
    return <ErrorScreen message={pageLoadError} />;
  }

  return (
    <DeckLayoutContext.Provider value={currentDeck}>
      <CardProvider deck={currentDeck}>
        <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
          <Stack.Screen name="edit" />
          <Stack.Screen name="play" />
        </Stack>
      </CardProvider>
    </DeckLayoutContext.Provider>
  );
}
