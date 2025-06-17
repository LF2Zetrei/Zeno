import React, { useState } from "react";
import {
  View,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import Constants from "expo-constants";

type Props = {
  orderId: string | null;
  onSuccess?: () => void;
};

const PublishOrderButton = ({ orderId, onSuccess }: Props) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePublishOrder = async () => {
    if (!orderId) {
      Alert.alert("Champ requis", "L'ID de la commande est requis.");
      return;
    }

    setLoading(true);

    try {
      const API_URL = Constants.expoConfig?.extra?.apiUrl;
      const url = `${API_URL}order/${orderId}/public`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error("Erreur lors de la validation de la commande.");

      Alert.alert("Succès", "Commande validée et rendue publique.");
      onSuccess?.();
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Valider et publier la commande"
        onPress={handlePublishOrder}
        disabled={loading}
        color="#0066CC"
      />
      {loading && <ActivityIndicator color="#0066CC" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
});

export default PublishOrderButton;
