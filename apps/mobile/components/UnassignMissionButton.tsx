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

const UnassignMissionButton = ({ missionId }: { missionId: string }) => {
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
              const API_URL = Constants.expoConfig?.extra?.apiUrl;
              const response = await fetch(
                `${API_URL}mission/${missionId}/unassign`,
                {
                  method: "PUT",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (!response.ok) throw new Error("Échec de la désinscription");

              Alert.alert("Tu as été retiré de la mission.");
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

export default UnassignMissionButton;
