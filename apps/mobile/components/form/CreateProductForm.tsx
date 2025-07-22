import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../styles/color";

type Product = {
  name: string;
  description: string;
  photoUrl: string;
  weight: string;
  quantity: string;
  estimatedPrice: string;
};

type Props = {
  onProductCreated?: (product: Product) => void;
};

export default function CreateProductForm({ onProductCreated }: Props) {
  const [form, setForm] = useState<Product>({
    name: "",
    description: "",
    photoUrl: "",
    weight: "",
    quantity: "",
    estimatedPrice: "",
  });

  const { token } = useAuth();
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  const handleChange = (key: keyof Product, value: string) => {
    const cleaned = value.replace(",", ".");
    setForm({ ...form, [key]: cleaned });
  };

  const handleCreateProduct = async () => {
    try {
      const res = await fetch(`${API_URL}product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json();
        Alert.alert("Erreur", error.message || "Erreur lors de la création.");
        return;
      }

      const data = await res.json();
      Alert.alert("Succès", "Produit créé avec succès !");
      onProductCreated?.(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Échec de la requête.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Créer un produit</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom du produit"
        value={form.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={form.description}
        onChangeText={(text) => handleChange("description", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="URL de la photo"
        value={form.photoUrl}
        onChangeText={(text) => handleChange("photoUrl", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Poids (kg)"
        keyboardType="decimal-pad"
        value={form.weight}
        onChangeText={(text) => handleChange("weight", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantité"
        keyboardType="decimal-pad"
        value={form.quantity}
        onChangeText={(text) => handleChange("quantity", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Prix estimé (€)"
        keyboardType="decimal-pad"
        value={form.estimatedPrice}
        onChangeText={(text) => handleChange("estimatedPrice", text)}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Créer le produit"
          onPress={handleCreateProduct}
          color={COLORS.primaryPink}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    gap: 12,
    borderColor: COLORS.primaryPink,
    borderWidth: 1,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "NunitoBold",
    color: COLORS.primaryPink,
    marginBottom: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    fontFamily: "Nunito",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    marginTop: 20,
  },
});
