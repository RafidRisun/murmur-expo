import { Stack } from "expo-router";
import React from "react";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: { color: "white", fontFamily: "Arial" },
        headerStyle: { backgroundColor: "black" },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Murmur" }} />
    </Stack>
  );
}
