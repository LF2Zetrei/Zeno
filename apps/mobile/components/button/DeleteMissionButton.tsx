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

const deleteMissionButton = ({ missionId }: { missionId: string }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCancelMission = () => {
    Alert.alert("Annuler la mission", "Confirmer l'annulation ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Confirmer",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            const API_URL = Constants.expoConfig?.extra?.apiUrl;
            const response = await fetch(`${API_URL}mission/${missionId}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Erreur lors de l'annulation");

            Alert.alert("Mission annulée");
          } catch (error: any) {
            Alert.alert("Erreur", error.message);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.warning}>Cette action annulera la mission.</Text>
      <Button
        title="Annuler la mission"
        onPress={handleCancelMission}
        color="#d11a2a"
        disabled={loading}
      />
      {loading && <ActivityIndicator color="#d11a2a" />}
    </View>
  );
};

export default deleteMissionButton;
