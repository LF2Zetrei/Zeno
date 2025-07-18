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
import { useAuth } from "../../context/AuthContext";
import { useProductsInOrder } from "../../hooks/order/getProductsByOrder";
import DeleteProductFromOrderButton from "../button/DeleteProductFromOrderButton";

interface EditOrderFormProps {
  orderId: string;
  initialData: {
    purchaseAddress?: string;
    purchaseCountry?: string;
    deadline?: string; // format : YYYY-MM-DD
    artisanName?: string;
  };
  onSubmit?: (updatedData: typeof initialData) => void;
}

const EditOrderForm = ({
  orderId,
  initialData,
  onSubmit,
}: EditOrderFormProps) => {
  const [form, setForm] = useState(initialData);
  const { token } = useAuth();
  const { products, loading } = useProductsInOrder(orderId);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;
  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}order/${orderId}`, {
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
          error.message || "Erreur lors de la mise à jour de la commande."
        );
      }

      Alert.alert("Succès", "Commande mise à jour avec succès.");
      if (onSubmit) onSubmit(form);
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Une erreur est survenue.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Modifier la commande</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Adresse d'achat</Text>
        <TextInput
          style={styles.input}
          value={form.purchaseAddress ?? ""}
          onChangeText={(text) => handleChange("purchaseAddress", text)}
          placeholder="456 avenue des créateurs"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pays d'achat</Text>
        <TextInput
          style={styles.input}
          value={form.purchaseCountry ?? ""}
          onChangeText={(text) => handleChange("purchaseCountry", text)}
          placeholder="Belgique"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date limite (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={form.deadline ?? ""}
          onChangeText={(text) => handleChange("deadline", text)}
          placeholder="2025-07-15"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nom de l'artisan</Text>
        <TextInput
          style={styles.input}
          value={form.artisanName ?? ""}
          onChangeText={(text) => handleChange("artisanName", text)}
          placeholder="Marie Dubois"
        />
      </View>

      <View style={styles.productsContainer}>
        <Text style={styles.subtitle}>Produits dans la commande</Text>

        {loading ? (
          <Text>Chargement des produits...</Text>
        ) : products.length === 0 ? (
          <Text>Aucun produit dans cette commande.</Text>
        ) : (
          products.map((product) => (
            <View key={product.id} style={styles.productItem}>
              <Text style={styles.productText}>
                {product.name || "Produit"} - {product.price} €
              </Text>
              <DeleteProductFromOrderButton
                orderId={orderId}
                productId={product.idProduct}
              />
            </View>
          ))
        )}
      </View>

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
    marginBottom: 12,
  },
  label: {
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
  },
  productsContainer: {
    marginVertical: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productItem: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  productText: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default EditOrderForm;
