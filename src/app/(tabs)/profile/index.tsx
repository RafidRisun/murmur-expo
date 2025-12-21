import { useAuth } from "@/src/context/authContext";
import React from "react";
import { Text, View } from "react-native";

export default function Profile() {
  const { signOut } = useAuth();
  return (
    <View>
      <Text>Profile</Text>
      <Text onPress={signOut}>Sign Out</Text>
    </View>
  );
}
