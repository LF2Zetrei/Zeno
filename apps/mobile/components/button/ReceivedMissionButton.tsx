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
import { COLORS } from "../../styles/color";

const ReceivedMissionButton = ({
  missionId,
  onSuccess,
}: {
  missionId: string;
  onSuccess?: () => void;
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleReceived = () => {
    Alert.alert(
      "Confirmer la réception de la commande",
      "⚠️ Une fois confirmée, cette action est irréversible.\n\nAs-tu bien reçu la commande ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Oui, j'ai reçu",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const API_URL = Constants.expoConfig?.extra?.apiUrl || "";
              const url = `${API_URL.replace(
                /\/$/,
                ""
              )}/mission/${missionId}/received`;

              const response = await fetch(url, {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                  errorData.message || "Échec de la confirmation"
                );
              }

              Alert.alert(
                "📦 Réception confirmée",
                "Merci pour ta confirmation !"
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
      <Text style={styles.warning}>
        Tu ne pourras plus modifier cette action après confirmation.
      </Text>
      <TouchableOpacity
        style={styles.receivedButton}
        onPress={handleReceived}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <>
            <Text style={styles.buttonText}>Chargement...</Text>
            <ActivityIndicator color="#fff" style={{ marginLeft: 8 }} />
          </>
        ) : (
          <Text style={styles.buttonText}>Confirmer la réception</Text>
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
  receivedButton: {
    backgroundColor: COLORS.primaryPink || "pink", // Fallback si non défini
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ReceivedMissionButton;
