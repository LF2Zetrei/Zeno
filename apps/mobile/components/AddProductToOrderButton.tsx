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

type Props = {
  orderIda: string;
  productIda: string;
  onSuccess?: () => void;
};

const AddProductToOrderButton = ({
  orderIda,
  productIda,
  onSuccess,
}: Props) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async () => {
    if (!orderIda || !productIda) {
      Alert.alert("Champs requis", "Les IDs commande et produit sont requis.");
      return;
    }

    try {
      const API_URL = Constants.expoConfig?.extra?.apiUrl;
      const url = `${API_URL}order/${orderIda}/product/${productIda}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout du produit.");

      Alert.alert("Succès", "Produit ajouté à la commande.");
      onSuccess?.();
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Ajouter le produit à la commande"
        onPress={handleAddProduct}
        disabled={loading}
        color="#228B22"
      />
      {loading && <ActivityIndicator color="#228B22" />}
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

export default AddProductToOrderButton;
