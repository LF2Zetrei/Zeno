import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import Constants from "expo-constants";

export default function ConnexionForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const { login } = useAuth();
  const API_URL = Constants.expoConfig?.extra?.apiUrl;
  console.log(API_URL);
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

      await login(token);
      Alert.alert("Succès", "Connecté avec succès !");
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible de se connecter au serveur.");
    }
  };

  return (
    <View>
      <Text style={styles.title}>ZENO</Text>
      <Text style={styles.slogan}>Offrez-vous l’introuvable</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#ccc"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </Pressable>

      <View style={styles.linkContainer}>
        <Text style={styles.text}>Pas encore de compte ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>Je m'inscris</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontFamily: "MuseoModernoBold",
    color: "#cb157c",
    textAlign: "center",
    marginBottom: 4,
  },
  slogan: {
    fontSize: 16,
    fontFamily: "Nunito",
    color: "#ffb01b",
    textAlign: "center",
    marginBottom: 32,
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
  text: {
    color: "#050212",
    fontSize: 14,
    fontFamily: "Nunito",
  },
  linkText: {
    color: "#ffb01b",
    fontWeight: "bold",
    marginLeft: 4,
    textDecorationLine: "underline",
  },
});
