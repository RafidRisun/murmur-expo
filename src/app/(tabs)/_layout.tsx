import { useAuth } from "@/src/context/authContext";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";

export default function TabLayout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/signin");
    }
  }, [isAuthenticated]);

  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="profile" options={{ title: "Settings" }} />
    </Tabs>
  );
}
