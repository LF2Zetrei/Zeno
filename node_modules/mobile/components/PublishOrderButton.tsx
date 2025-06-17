import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";
import { useAuth } from "../context/AuthContext";

type Props = {
  orderId: string;
  onSuccess?: () => void;
};

const PublishOrderButton = ({ orderId, onSuccess }: Props) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePublish = () => {
    Alert.alert(
      "Rendre publique la commande",
      "Souhaites-tu la valider et la publier ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Valider",
          onPress: async () => {
            setLoading(true);
            try {
              const API_URL = Constants.expoConfig?.extra?.apiUrl;
              const response = await fetch(
                `${API_URL}order/${orderId}/public`,
                {
                  method: "PUT",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (!response.ok) throw new Error("Échec de la publication");

              Alert.alert("Commande rendue publique !");
              onSuccess?.();
            } catch (error: any) {
              Alert.alert("Erreur", error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.warning}>La commande sera visible publiquement.</Text>
      <Button
        title="Publier la commande"
        onPress={handlePublish}
        disabled={loading}
      />
      {loading && <ActivityIndicator color="#0000ff" />}
    </View>
  );
};

export default PublishOrderButton;
