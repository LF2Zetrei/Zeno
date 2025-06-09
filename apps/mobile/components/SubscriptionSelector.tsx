import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import Constants from "expo-constants";

const SubscriptionSelector = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<"basic" | "premium" | null>(null);

  const updateSubscription = async (subscriptionType: "basic" | "premium") => {
    setLoading(true);
    setSelected(subscriptionType);

    const API_URL = Constants.expoConfig?.extra?.apiUrl;

    try {
      const response = await fetch(
        `${API_URL}user/subscription?subscriptionType=${subscriptionType}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Échec de la mise à jour");
      }

      const data = await response.json();
      Alert.alert("Succès", `Abonnement mis à jour en ${subscriptionType}`);
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisir un abonnement</Text>

      <View style={styles.buttons}>
        <Button
          title="Abonnement BASIC"
          color={selected === "basic" ? "green" : undefined}
          onPress={() => updateSubscription("basic")}
        />
        <Button
          title="Abonnement PREMIUM"
          color={selected === "premium" ? "gold" : undefined}
          onPress={() => updateSubscription("premium")}
        />
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttons: {
    flexDirection: "column",
    gap: 10,
  },
});

export default SubscriptionSelector;
