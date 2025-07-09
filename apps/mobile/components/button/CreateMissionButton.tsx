import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";
import { useAuth } from "../../context/AuthContext";

const CreateMissionButton = () => {
  const { token } = useAuth();
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateMission = async () => {
    if (!orderId) {
      Alert.alert("Champs requis", "Veuillez entrer l'ID de la commande.");
      return;
    }

    setLoading(true);
    try {
      const API_URL = Constants.expoConfig?.extra?.apiUrl;
      const response = await fetch(`${API_URL}mission/${orderId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error("Erreur lors de la création de mission.");

      Alert.alert("Succès", "Mission créée à partir de la commande !");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ID de la commande :</Text>
      <TextInput
        value={orderId}
        onChangeText={setOrderId}
        placeholder="Ex: de6252da-5e70-4f2f-a64a-7f0cd485bf82"
        style={styles.input}
        autoCapitalize="none"
      />
      <Button
        title="Créer la mission"
        onPress={handleCreateMission}
        disabled={loading}
        color="#007AFF"
      />
      {loading && <ActivityIndicator color="#007AFF" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
});

export default CreateMissionButton;
