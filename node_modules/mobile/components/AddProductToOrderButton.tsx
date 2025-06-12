import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import Constants from "expo-constants";

const AddProductToOrderButton = () => {
  const { token } = useAuth();
  const [orderId, setOrderId] = useState("");
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async () => {
    if (!orderId || !productId) {
      Alert.alert("Champs requis", "Veuillez remplir les deux champs.");
      return;
    }

    setLoading(true);
    try {
      const API_URL = Constants.expoConfig?.extra?.apiUrl;
      const url = `${API_URL}order/${orderId}/product/${productId}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout du produit.");

      Alert.alert("Succès", "Produit ajouté à la commande.");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ID de la commande :</Text>
      <TextInput
        value={orderId}
        onChangeText={setOrderId}
        placeholder="Entrez l'ID de la commande"
        style={styles.input}
        autoCapitalize="none"
      />
      <Text style={styles.label}>ID du produit :</Text>
      <TextInput
        value={productId}
        onChangeText={setProductId}
        placeholder="Entrez l'ID du produit"
        style={styles.input}
        autoCapitalize="none"
      />
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
  label: {
    fontWeight: "bold",
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
  },
});

export default AddProductToOrderButton;
