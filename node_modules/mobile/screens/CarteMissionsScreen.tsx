import { View, Text, Platform } from "react-native";
import { useEffect, useState } from "react";

export default function CarteMissionsScreen() {
  const [CarteMissionsMap, setCarteMissionsMap] = useState<any>(null);

  useEffect(() => {
    if (Platform.OS !== "web") {
      import("./CarteMissionsMap").then((module) => {
        setCarteMissionsMap(() => module.default);
      });
    }
  }, []);

  if (Platform.OS === "web") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>La carte n’est disponible que sur mobile pour le moment.</Text>
      </View>
    );
  }

  if (!CarteMissionsMap) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Chargement de la carte…</Text>
      </View>
    );
  }

  return <CarteMissionsMap />;
}
