import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import Constants from "expo-constants";

export default function ConnexionForm() {
  const [email, setEmail] = useState("fernandesl@cy-tech.fr");
  const [password, setPassword] = useState("Lucasf64!");
  const navigation = useNavigation();
  const { login } = useAuth();
  const API_URL = Constants.expoConfig?.extra?.apiUrl;
  console.log(`${API_URL}auth/login`);
  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        Alert.alert("Erreur", error.message || "Échec de connexion");
        return;
      }

      const data = await res.json();
      const token = data.token;

      await login(token); // 👈 ici

      Alert.alert("Succès", "Connecté avec succès !");
      console.log("Token reçu :", token);
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible de se connecter au serveur.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Se connecter" onPress={handleLogin} />
      <View style={styles.linkContainer}>
        <Text>Pas encore de compte ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>Inscris-toi ici</Text>
        </TouchableOpacity>
      </View>
    </View>
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
