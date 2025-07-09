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
import { useActualiserPositionTracking } from "../hooks/position/useRTefreshPosition";

const AcceptMissionButton = ({
  missionId,
  onSuccess,
}: {
  missionId: string;
  onSuccess?: () => void;
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const { actualiserPosition } = useActualiserPositionTracking();

  const handleAcceptMission = () => {
    Alert.alert(
      "Confirmer l'acceptation de la mission",
      "⚠️ Une fois cette mission acceptée, vous serez responsable de sa livraison. Veuillez vous assurer d'avoir discuté avec l'acheteur avant de confirmer.\n\nSouhaitez-vous devenir le livreur ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Accepter la mission",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const API_URL = Constants.expoConfig?.extra?.apiUrl || "";
              const url = `${API_URL.replace(
                /\/$/,
                ""
              )}/mission/${missionId}/assign`;

              const response = await fetch(url, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
              });

              if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Échec de l’assignation");
              }

              // ✅ Mise à jour immédiate de la position
              await actualiserPosition(missionId);

              Alert.alert(
                "🎉 Mission acceptée",
                "Vous êtes maintenant assigné à cette mission."
              );
              if (onSuccess) onSuccess();
            } catch (error: any) {
              Alert.alert(
                "❌ Erreur",
                error.message || "Une erreur est survenue."
              );
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
