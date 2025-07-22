import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import Constants from "expo-constants";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../styles/color";

type OrderForm = {
  purchaseAddress: string;
  purchaseCountry: string;
  deadline: string;
  artisanName: string;
  city: string;
  transports?: string;
};

type Props = {
  onOrderCreated?: (product: any) => void;
};

export default function CreateOrderForm({ onOrderCreated }: Props) {
  const [form, setForm] = useState<OrderForm>({
    purchaseAddress: "",
    purchaseCountry: "",
    deadline: "",
    artisanName: "",
    city: "",
    transports: "",
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

      const rawText = await res.text(); // <-- lis brut, avant json()
      console.log("Réponse brute : ", rawText);

      if (!res.ok) {
        try {
          const error = JSON.parse(rawText); // essaie de parser quand même
          Alert.alert("Erreur", error.message || "Erreur lors de la création.");
        } catch (e) {
          Alert.alert("Erreur", "Réponse non JSON : " + rawText);
        }
        return;
      }

      const product = JSON.parse(rawText); // si OK, parsé comme JSON
      Alert.alert("Succès", "Commande créée avec succès !");
      console.log("Produit créé :", product);
      onOrderCreated?.(product);
    } catch (err) {
      console.error("Erreur brute :", err);
      Alert.alert("Erreur", "Échec de la requête.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Informations de commande</Text>

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
        placeholder="Transports autorisés (train, avion...)"
        value={form.transports}
        onChangeText={(text) => handleChange("transports", text)}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Créer la commande"
          color={COLORS.primaryPink}
          onPress={handleCreateOrder}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
    backgroundColor: COLORS.card,
    borderRadius: 12,
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
