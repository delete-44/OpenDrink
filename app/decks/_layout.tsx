import { Stack } from "expo-router";
import React from "react";

export default function DecksLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="new" />
    </Stack>
  );
}
