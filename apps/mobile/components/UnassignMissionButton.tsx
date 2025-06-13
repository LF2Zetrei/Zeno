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

const UnassignMissionButton = ({
  missionId,
  onSuccess,
}: {
  missionId: string;
  onSuccess?: () => void; // optionnel
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUnassign = () => {
    Alert.alert(
      "Se retirer de la mission",
      "Souhaites-tu vraiment te retirer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Se retirer",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const API_URL = Constants.expoConfig?.extra?.apiUrl || "";
              const url = `${API_URL.replace(
                /\/$/,
                ""
              )}/mission/${missionId}/unassign`;

              const response = await fetch(url, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
              });

              if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                  errorData.message || "Échec de la désinscription"
                );
              }

              Alert.alert("Tu as été retiré de la mission.");
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
        Tu ne seras plus affecté à cette mission.
      </Text>
      <Button
        title="Se retirer de la mission"
        onPress={handleUnassign}
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

export default UnassignMissionButton;
