import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import { useAuth } from "../context/AuthContext";

interface EditProductFormProps {
  productId: string;
  initialData: {
    name?: string;
    description?: string;
    photoUrl?: string;
    weight?: number;
    quantity?: number;
    estimatedPrice?: number;
  };
  onSubmit?: (updatedData: typeof initialData) => void;
}

const EditProductForm = ({
  productId,
  initialData,
  onSubmit,
}: EditProductFormProps) => {
  const [form, setForm] = useState(initialData);
  const { token } = useAuth(); // ou utilise AsyncStorage.getItem("token")
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  const handleChange = (field: keyof typeof form, value: string) => {
    // Convertir en nombre pour les champs numériques
    const numericFields: (keyof typeof form)[] = [
      "weight",
      "quantity",
      "estimatedPrice",
    ];
    const newValue = numericFields.includes(field)
      ? parseFloat(value) || 0
      : value;
    setForm({ ...form, [field]: newValue });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}product/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Erreur lors de la mise à jour du produit."
        );
      }

      Alert.alert("Succès", "Produit mis à jour avec succès.");
      if (onSubmit) onSubmit(form);
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Une erreur est survenue.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Modifier le produit</Text>

      {Object.entries(form).map(([field, value]) => (
        <View key={field} style={styles.inputContainer}>
          <Text style={styles.label}>{field}</Text>
          <TextInput
            style={styles.input}
            value={String(value ?? "")}
            onChangeText={(text) =>
              handleChange(field as keyof typeof form, text)
            }
            placeholder={`Entrez ${field}`}
            keyboardType={
              ["weight", "quantity", "estimatedPrice"].includes(field)
                ? "decimal-pad"
                : "default"
            }
            autoCapitalize="none"
          />
        </View>
      ))}

      <Button title="Enregistrer les modifications" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
  },
  inputContainer: {
    gap: 4,
  },
  label: {
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
  },
});

export default EditProductForm;
