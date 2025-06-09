import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";

export default function RegisterForm() {
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    pseudo: "",
    email: "",
    password: "",
    phone: "",
    country: "",
    address: "",
    postalCode: "",
  });

  const navigation = useNavigation();

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  const handleRegister = async () => {
    try {
      const res = await fetch(`${API_URL}auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json();
        Alert.alert("Erreur", error.message || "Erreur d'inscription.");
        return;
      }

      const data = await res.json();
      Alert.alert("Succès", "Utilisateur inscrit avec succès !");
      console.log("Réponse :", data);
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Échec de la requête.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.entries(form).map(([key, value]) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={key}
          secureTextEntry={key === "password"}
          value={value}
          onChangeText={(text) => handleChange(key, text)}
        />
      ))}
      <Button title="S'inscrire" onPress={handleRegister} />
      <View style={styles.linkContainer}>
        <Text>Déjà un compte ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Connexion")}>
          <Text style={styles.linkText}>Connecte-toi ici</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "blue",
  },
});
