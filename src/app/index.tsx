import { db } from "@/src/firebase/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Index() {
  useEffect(() => {
    const testFirestore = async () => {
      try {
        await addDoc(collection(db, "test"), {
          hello: "firebase",
          createdAt: serverTimestamp(),
        });
        console.log("🔥 Firestore connected successfully");
      } catch (e) {
        console.error("❌ Firestore error:", e);
      }
    };

    testFirestore();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
