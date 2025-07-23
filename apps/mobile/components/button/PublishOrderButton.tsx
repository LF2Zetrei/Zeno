import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import Constants from "expo-constants";
import { useStripe } from "@stripe/stripe-react-native";
import { COLORS } from "../../styles/color";

type Props = {
  orderId: string | null;
  onSuccess?: () => void;
};

const PublishOrderButton = ({ orderId, onSuccess }: Props) => {
  const { token } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const handlePublishOrder = async () => {
    if (!orderId) {
      Alert.alert("Champ requis", "L'ID de la commande est requis.");
      return;
    }

    setLoading(true);

    try {
      const API_URL = Constants.expoConfig?.extra?.apiUrl;
      const res = await fetch(`${API_URL}payment/pay_mission/${orderId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Échec de l'initialisation du paiement.");

      const { clientSecret, paymentIntentId } = await res.json();

      const merchantDisplayName =
        Constants.expoConfig?.extra?.merchantDisplayName || "Zeno";

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName,
      });

      if (initError) throw new Error(initError.message);

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) throw new Error(paymentError.message);

      const response = await fetch(`${API_URL}order/${orderId}/public`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentIntentId }),
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
      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handlePublishOrder}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Chargement..." : "Valider et publier la commande"}
        </Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator color={COLORS.primaryPink} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  button: {
    backgroundColor: COLORS.primaryPink,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.background,
    fontWeight: "600",
    fontSize: 16,
  },
});

export default PublishOrderButton;
