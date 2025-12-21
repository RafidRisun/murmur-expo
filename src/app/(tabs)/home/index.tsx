import { useAuth } from "@/src/context/authContext";
import { createMurmur } from "@/src/services/murmurmService";
import { Button, Input } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import tw from "twrnc";

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

  const [newMurmur, setNewMurmur] = useState("");

  const handlePost = async () => {
    try {
      const response = await createMurmur(
        newMurmur,
        user?.username || "Anonymous"
      );
      setNewMurmur("");
      if (response) {
        Alert.alert("Success", "Murmur posted successfully!");
      }
    } catch (error) {
      console.error("Error posting murmur:", error);
      Alert.alert("Error", "Failed to post murmur. Please try again.");
    }
  };

  return (
    <View style={tw`flex-1 justify-start items-center bg-black p-4`}>
      <Input
        style={tw`w-full`}
        placeholder="Any new Murmur?"
        value={newMurmur}
        onChangeText={setNewMurmur}
      />
      <Button style={tw`mt-4 w-full`} onPress={handlePost}>
        Post Murmur
      </Button>
    </View>
  );
}
