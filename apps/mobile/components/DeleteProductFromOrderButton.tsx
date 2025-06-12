import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import Constants from "expo-constants";

const DeleteProductFromOrderButton = ({
  orderId,
  productId,
}: {
  orderId: string;
  productId: string;
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDeleteProduct = () => {
    Alert.alert(
      "Supprimer le produit",
      "Supprimer ce produit de la commande ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const API_URL = Constants.expoConfig?.extra?.apiUrl;
              const url = `${API_URL}order/${orderId}/product/${productId}`;
              const response = await fetch(url, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });

              if (!response.ok)
                throw new Error("Erreur lors de la suppression");

              Alert.alert("Succès", "Produit supprimé de la commande.");
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
      <Text style={styles.warning}>Ce produit sera retiré de la commande.</Text>
      <Button
        title="Retirer le produit"
        onPress={handleDeleteProduct}
        color="#d11a2a"
        disabled={loading}
      />
      {loading && <ActivityIndicator color="#d11a2a" />}
    </View>
  );
};

export default DeleteProductFromOrderButton;
