import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import tw from "twrnc";
import { useAuth } from "../context/authContext";

export default function Entry() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/auth/signin");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <View style={tw`flex-1 justify-center items-center bg-white`}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}
