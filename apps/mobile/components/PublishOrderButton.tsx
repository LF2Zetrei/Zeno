import React, { useState } from "react";
import {
  View,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import Constants from "expo-constants";
import { useStripe } from "@stripe/stripe-react-native";

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

      // 1. Appel à /pay_mission/{orderId}
      const res = await fetch(`${API_URL}pay_mission/${orderId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Échec de l'initialisation du paiement.");

      const { clientSecret } = await res.json();

      // 2. Initialiser le PaymentSheet
      const merchantDisplayName =
        Constants.expoConfig?.extra?.merchantDisplayName || "Zeno";

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName,
      });

      if (initError) throw new Error(initError.message);

      // 3. Présenter le PaymentSheet
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) throw new Error(paymentError.message);

      // 4. Valider et publier la commande
      const url = `${API_URL}order/${orderId}/public`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      <Button
        title="Valider et publier la commande"
        onPress={handlePublishOrder}
        disabled={loading}
        color="#0066CC"
      />
      {loading && <ActivityIndicator color="#0066CC" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
});

export default PublishOrderButton;
