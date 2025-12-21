import { useAuth } from "@/src/context/authContext";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Index() {
  const { user, isAuthenticated } = useAuth();
  useEffect(() => {
    console.log("User in home index:", user);
    console.log("Is Authenticated in home index:", isAuthenticated);
  }, [user]);

  if (user === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
      <Text>Indexxxxxxxxxxxxx</Text>
    </View>
  );
}
