import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import Constants from "expo-constants";
import { useAuth } from "../context/AuthContext";

type OrderForm = {
  purchaseAddress: string;
  purchaseCountry: string;
  deadline: string; // format YYYY-MM-DD
  artisanName: string;
  city: string;
};

type Props = {
  onOrderCreated?: (product: any) => void; // le backend retourne un "produit"
};

export default function CreateOrderForm({ onOrderCreated }: Props) {
  const [form, setForm] = useState<OrderForm>({
    purchaseAddress: "",
    purchaseCountry: "",
    deadline: "",
    artisanName: "",
    city: "",
  });

  const { token } = useAuth();
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  const handleChange = (key: keyof OrderForm, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleCreateOrder = async () => {
    if (!token) {
      Alert.alert("Erreur", "Token manquant, impossible de créer la commande.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}order/create`, {
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

      const product = await res.json();
      Alert.alert("Succès", "Commande créée avec succès !");
      console.log("Produit créé :", product);

      if (onOrderCreated) {
        onOrderCreated(product);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Échec de la requête.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Adresse d'achat"
        value={form.purchaseAddress}
        onChangeText={(text) => handleChange("purchaseAddress", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Pays"
        value={form.purchaseCountry}
        onChangeText={(text) => handleChange("purchaseCountry", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Date limite (AAAA-MM-JJ)"
        value={form.deadline}
        onChangeText={(text) => handleChange("deadline", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom de l'artisan"
        value={form.artisanName}
        onChangeText={(text) => handleChange("artisanName", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Ville"
        value={form.city}
        onChangeText={(text) => handleChange("city", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Transports de livraisons autorisés : train, avion, voiture, bateau ...."
        value={form.transports}
        onChangeText={(text) => handleChange("transports", text)}
      />

      <Button title="Créer la commande" onPress={handleCreateOrder} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 50,
    gap: 12,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
  },
});
