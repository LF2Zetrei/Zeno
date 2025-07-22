import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
import { useAuth } from "../../context/AuthContext";
import { useActualiserPositionTracking } from "../../hooks/position/useRTefreshPosition";
import { COLORS } from "../../styles/color";

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
      <TouchableOpacity
        style={styles.acceptButton}
        onPress={handleAcceptMission}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.acceptButtonText}>
          {loading ? "Chargement..." : "Accepter la mission"}
        </Text>
        {loading && (
          <ActivityIndicator color="#fff" style={{ marginLeft: 8 }} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: "center",
    width: "100%",
  },
  warning: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  acceptButton: {
    backgroundColor: COLORS.primaryPink,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  acceptButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AcceptMissionButton;
