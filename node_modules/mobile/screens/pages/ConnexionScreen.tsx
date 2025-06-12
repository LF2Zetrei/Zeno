import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../context/AuthContext"; // 🔄 Import du contexte

export default function ConnexionScreen() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const { login } = useAuth(); // 🎯 Appel à la fonction login du contexte

  const handleConnexion = async () => {
    const payload = {
      username: email,
      password: motDePasse,
    };

    try {
      const response = await fetch("http://192.168.0.20:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur de connexion :", errorData);
        Alert.alert("Erreur", "Identifiants invalides");
        return;
      }

      const data = await response.json();
      console.log("Connexion réussie :", data);

      // ✅ Stocke le token via le contexte
      await login(data.token); // Cela redirigera automatiquement vers l'écran d'accueil
    } catch (error) {
      console.error("Erreur réseau :", error);
      Alert.alert("Erreur", "Impossible de contacter le serveur.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={motDePasse}
        onChangeText={setMotDePasse}
      />
      <Button title="Se connecter" onPress={handleConnexion} />

      <TouchableOpacity onPress={() => navigation.navigate("Inscription")}>
        <Text style={styles.link}>Pas encore de compte ? Créez-en un ici</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
