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
import { useAuth } from "../../context/AuthContext";

const DeliveredMissionButton = ({
  missionId,
  onSuccess,
}: {
  missionId: string;
  onSuccess?: () => void;
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDelivered = () => {
    Alert.alert(
      "Confirmer la livraison de la commande",
      "Avez-vous vraiment livré la commande ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const API_URL = Constants.expoConfig?.extra?.apiUrl || "";
              const url = `${API_URL.replace(
                /\/$/,
                ""
              )}/mission/${missionId}/delivered`;

              const response = await fetch(url, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
              });

              if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                  errorData.message || "Échec de la comfirmation"
                );
              }

              Alert.alert("La commande à bien été livrée.");
              if (onSuccess) onSuccess();
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
      <Text style={styles.warning}>
        Tu ne pourras plus changer la comfirmation de la livraison.
      </Text>
      <Button
        title="Comfrimer la livraison"
        onPress={handleDelivered}
        color="#d11a2a"
        disabled={loading}
      />
      {loading && <ActivityIndicator color="#d11a2a" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
    alignItems: "center",
  },
  warning: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
  },
});

export default DeliveredMissionButton;
