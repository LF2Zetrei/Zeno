import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext"; // adapte ce chemin si besoin

interface EditProfileFormProps {
  initialData: {
    firstName?: string;
    lastName?: string;
    pseudo?: string;
    email?: string;
    password?: string;
    phone?: string;
    country?: string;
    address?: string;
    postalCode?: string;
  };
  onSubmit?: (updatedData: typeof initialData) => void; // Optionnel si le backend prend le relais
}

const EditProfileForm = ({ initialData, onSubmit }: EditProfileFormProps) => {
  const [form, setForm] = useState(initialData);
  const { token } = useAuth();

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://192.168.0.12:8080/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la mise à jour.");
      }

      Alert.alert("Succès", "Profil mis à jour avec succès.");
      if (onSubmit) onSubmit(form);
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Une erreur est survenue.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Modifier profil</Text>

      {Object.entries(form).map(([field, value]) => (
        <View key={field} style={styles.inputContainer}>
          <Text style={styles.label}>{field}</Text>
          <TextInput
            style={styles.input}
            value={value ?? ""}
            onChangeText={(text) =>
              handleChange(field as keyof typeof form, text)
            }
            placeholder={`Entrez votre ${field}`}
            secureTextEntry={field === "password"}
            autoCapitalize={field === "email" ? "none" : "sentences"}
          />
        </View>
      ))}

      <Button title="Enregistrer" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
  },
  inputContainer: {
    gap: 4,
  },
  label: {
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
  },
});

export default EditProfileForm;
