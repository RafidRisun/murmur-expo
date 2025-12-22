import { Button } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import tw from "twrnc";
import { likeMurmur } from "../services/murmurmService";
import { MurmurType } from "../types/murmurType";

export default function MurmurCard({ murmur }: { murmur: MurmurType }) {
  const router = useRouter();
  //const [localLikes, setLocalLikes] = useState(murmur.likesCount ?? 0);
  const [localMurmur, setLocalMurmur] = useState<MurmurType>(murmur);

  const handleLike = async (murmurId: string) => {
    // Implement like functionality here
    console.log(`Liked murmur with ID: ${murmurId}`);
    try {
      await likeMurmur(murmurId);
      setLocalMurmur((prev) => ({
        ...prev,
        likesCount: (prev.likesCount || 0) + 1,
      }));
    } catch (error) {
      console.error("Error liking murmur:", error);
    }
  };

  return (
    <View
      key={murmur.id}
      style={tw`mb-4 p-4 border border-gray-700 rounded w-full`}
    >
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/(tabs)/home/profile",
            params: { userId: murmur.userId },
          })
        }
      >
        <Text style={tw`text-white text-lg font-bold`}>
          {murmur.username}&apos;s Murmur
        </Text>
      </Pressable>
      <Text style={tw`text-white text-base font-normal`}>
        {"	"}
        {murmur.text}
      </Text>
      <View style={tw`flex flex-row justify-between mt-4`}>
        <Text style={tw`text-gray-400 text-sm`}>
          {localMurmur.likesCount || 0} Likes
        </Text>
        <Button onPress={() => handleLike(murmur.id)}>Like</Button>
      </View>
    </View>
  );
}
