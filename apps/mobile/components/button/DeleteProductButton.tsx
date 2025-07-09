import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import Constants from "expo-constants";

interface DeleteProductButtonProps {
  productId: string;
  onDeleted?: () => void;
}

const DeleteProductButton = ({
  productId,
  onDeleted,
}: DeleteProductButtonProps) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  const handleDeleteProduct = () => {
    Alert.alert(
      "Confirmation",
      "Es-tu sûr de vouloir supprimer ce produit ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            if (!token) {
              Alert.alert("Erreur", "Token d'authentification manquant.");
              return;
            }

            setLoading(true);

            try {
              const response = await fetch(`${API_URL}product/${productId}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!response.ok) {
                throw new Error("Échec de la suppression du produit");
              }

              Alert.alert("Succès", "Produit supprimé avec succès.");
              if (onDeleted) onDeleted();
            } catch (error: any) {
              Alert.alert("Erreur", error.message || "Une erreur est survenue");
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
        Cette action supprimera définitivement ce produit.
      </Text>
      <Button
        title="Supprimer le produit"
        onPress={handleDeleteProduct}
        color="#d11a2a"
        disabled={loading}
      />
      {loading && <ActivityIndicator size="large" color="#d11a2a" />}
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
    color: "#d11a2a",
    textAlign: "center",
  },
});

export default DeleteProductButton;
