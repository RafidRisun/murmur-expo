import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Signin() {
  const router = useRouter();
  return (
    <View>
      <Text>Signin</Text>
      <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
        <Text>Home</Text>
      </TouchableOpacity>
    </View>
  );
}
