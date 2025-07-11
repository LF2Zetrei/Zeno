import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ImageBackground,
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
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

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
      Alert.alert("Succès", "Inscription réussie !");
      console.log("Réponse :", data);
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Échec de la requête.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/leafs/frise-logo.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.overlay}>
        <Text style={styles.title}>Inscription</Text>
        <Text style={styles.subtitle}>Rejoins l’univers de l’introuvable</Text>

        {Object.entries(form).map(([key, value]) => (
          <TextInput
            key={key}
            style={styles.input}
            placeholder={getPlaceholder(key)}
            placeholderTextColor="#ccc"
            secureTextEntry={key === "password"}
            value={value}
            onChangeText={(text) => handleChange(key, text)}
          />
        ))}

        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </Pressable>

        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Déjà un compte ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Connexion")}>
            <Text style={styles.linkAction}>Je me connecte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

// Utilitaire pour avoir des placeholders jolis
const getPlaceholder = (key: string) => {
  const map: Record<string, string> = {
    lastName: "Nom",
    firstName: "Prénom",
    pseudo: "Pseudo",
    email: "Adresse e-mail",
    password: "Mot de passe",
    phone: "Téléphone",
    country: "Pays",
    address: "Adresse",
    postalCode: "Code postal",
  };
  return map[key] || key;
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    backgroundColor: "rgba(5, 2, 18, 0.9)",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    color: "#cb157c",
    textAlign: "center",
    fontFamily: "MuseoModernoBold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#ffb01b",
    textAlign: "center",
    fontFamily: "Nunito",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#2f167f",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#cb157c",
    marginBottom: 12,
    fontFamily: "Nunito",
  },
  button: {
    backgroundColor: "#cb157c",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#fcff00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: "#050212",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "NunitoBold",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  linkText: {
    color: "#ffffffcc",
    fontSize: 14,
    fontFamily: "Nunito",
  },
  linkAction: {
    color: "#ffb01b",
    fontWeight: "bold",
    marginLeft: 4,
    textDecorationLine: "underline",
  },
});
