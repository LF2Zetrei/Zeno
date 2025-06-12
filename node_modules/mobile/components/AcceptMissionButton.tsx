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

const AcceptMissionButton = ({ missionId }: { missionId: string }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAcceptMission = () => {
    Alert.alert("Accepter la mission", "Souhaites-tu devenir le livreur ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Accepter",
        onPress: async () => {
          setLoading(true);
          try {
            const API_URL = Constants.expoConfig?.extra?.apiUrl;
            const response = await fetch(
              `${API_URL}mission/${missionId}/assign`,
              {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (!response.ok) throw new Error("Échec de l’assignation");

            Alert.alert("Mission acceptée !");
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
      <Text style={styles.warning}>Tu seras responsable de cette mission.</Text>
      <Button
        title="Accepter la mission"
        onPress={handleAcceptMission}
        disabled={loading}
      />
      {loading && <ActivityIndicator color="#0000ff" />}
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

export default AcceptMissionButton;
