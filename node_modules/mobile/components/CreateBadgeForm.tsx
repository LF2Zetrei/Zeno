import React, { useState } from "react";
import { TextInput, Button, StyleSheet, ScrollView, Alert } from "react-native";
import Constants from "expo-constants";
import { useAuth } from "../context/AuthContext";

export default function CreateBadgeForm() {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const { token } = useAuth();
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  const handleCreate = async () => {
    try {
      const res = await fetch(`${API_URL}badge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nom, description }),
      });

      if (!res.ok) {
        const error = await res.json();
        Alert.alert("Erreur", error.message || "Échec création badge");
        return;
      }

      Alert.alert("Succès", "Badge créé !");
      setNom("");
      setDescription("");
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Erreur réseau.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nom du badge"
        value={nom}
        onChangeText={setNom}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Créer le badge" onPress={handleCreate} />
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
});
