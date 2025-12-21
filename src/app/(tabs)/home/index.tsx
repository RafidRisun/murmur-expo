import { useAuth } from "@/src/context/authContext";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const { user, isAuthenticated } = useAuth();
  useEffect(() => {
    console.log("User in home index:", user);
    console.log("Is Authenticated in home index:", isAuthenticated);
  }, []);
  return (
    <View>
      <Text>Indexxxxxxxxxxxxx</Text>
    </View>
  );
}
