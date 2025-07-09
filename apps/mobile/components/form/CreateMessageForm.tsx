import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";
import { useAuth } from "../../context/AuthContext";

type Props = {
  receiverId: string;
};

export default function CreateMessageForm({ receiverId }: Props) {
  const [content, setContent] = useState("");
  const { token } = useAuth();
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  const handleSend = async () => {
    try {
      const res = await fetch(`${API_URL}message/${receiverId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `content=${encodeURIComponent(content)}`,
      });

      if (!res.ok) {
        const error = await res.text();
        Alert.alert("Erreur", error || "Échec de l'envoi du message.");
        return;
      }

      Alert.alert("Succès", "Message envoyé !");
      setContent("");
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Erreur réseau.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Message"
        value={content}
        onChangeText={setContent}
      />
      <Button title="Envoyer le message" onPress={handleSend} />
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
