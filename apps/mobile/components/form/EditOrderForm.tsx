import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import Constants from "expo-constants";
import { useAuth } from "../../context/AuthContext";
import { useProductsInOrder } from "../../hooks/order/getProductsByOrder";
import DeleteProductFromOrderButton from "../button/DeleteProductFromOrderButton";
import { COLORS } from "../../styles/color";

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
      <View style={styles.card}>
        <Text style={styles.title}>Modifier la commande</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Adresse d'achat</Text>
          <TextInput
            style={styles.input}
            value={form.purchaseAddress ?? ""}
            onChangeText={(text) => handleChange("purchaseAddress", text)}
            placeholder="456 avenue des créateurs"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pays d'achat</Text>
          <TextInput
            style={styles.input}
            value={form.purchaseCountry ?? ""}
            onChangeText={(text) => handleChange("purchaseCountry", text)}
            placeholder="Belgique"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date limite (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={form.deadline ?? ""}
            onChangeText={(text) => handleChange("deadline", text)}
            placeholder="2025-07-15"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom de l'artisan</Text>
          <TextInput
            style={styles.input}
            value={form.artisanName ?? ""}
            onChangeText={(text) => handleChange("artisanName", text)}
            placeholder="Marie Dubois"
          />
        </View>

        <View style={styles.productsContainer}>
          <Text style={styles.sectionTitle}>Produits dans la commande</Text>

          {loading ? (
            <Text>Chargement des produits...</Text>
          ) : products.length === 0 ? (
            <Text>Aucun produit dans cette commande.</Text>
          ) : (
            products.map((product) => (
              <View key={product.id} style={styles.productCard}>
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

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enregistrer les modifications</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1.5,
    borderColor: COLORS.primaryPink,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "flex-start",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: COLORS.primaryBlue,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
    width: "100%",
  },
  label: {
    fontWeight: "500",
    marginBottom: 4,
    color: COLORS.dark,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.primaryPink,
  },
  productCard: {
    backgroundColor: "#e9e9f0",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  productText: {
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    backgroundColor: COLORS.primaryPink,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  buttonText: {
    color: COLORS.background,
    fontWeight: "600",
    fontSize: 16,
  },
});

export default EditOrderForm;
