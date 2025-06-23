import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

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
  onSubmit?: () => void;
}

const EditProfileForm = ({ initialData, onSubmit }: EditProfileFormProps) => {
  const navigation = useNavigation();
  const [form, setForm] = useState(initialData);
  const [identityDoc, setIdentityDoc] = useState<any>(null);
  const { token } = useAuth();
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const pickIdentityDocument = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      setIdentityDoc(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value ?? "");
      });

      if (identityDoc) {
        const uriParts = identityDoc.uri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append("pieceIdentite", {
          uri: identityDoc.uri,
          name: `identity.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      const response = await fetch(`${API_URL}user/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la mise à jour.");
      }

      Alert.alert("Succès", "Profil mis à jour avec succès.");
      if (onSubmit) onSubmit();
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Une erreur est survenue.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Modifier votre profil</Text>

      {[
        ["email", "Email"],
        ["pseudo", "Pseudonyme"],
        ["lastName", "Nom"],
        ["firstName", "Prénom"],
        ["password", "Mot de passe"],
        ["phone", "Téléphone"],
        ["country", "Pays"],
        ["address", "Adresse"],
        ["postalCode", "Code postal"],
      ].map(([key, label]) => (
        <View key={key} style={styles.inputContainer}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={key === "password"}
            autoCapitalize={key === "email" ? "none" : "sentences"}
            value={form[key as keyof typeof form] ?? ""}
            onChangeText={(text) =>
              handleChange(key as keyof typeof form, text)
            }
          />
        </View>
      ))}

      <TouchableOpacity
        style={styles.identityButton}
        onPress={pickIdentityDocument}
      >
        <Text style={styles.identityButtonText}>
          {identityDoc
            ? "Pièce sélectionnée ✅"
            : "Joindre une pièce d'identité"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.roleButton}
        onPress={() => navigation.navigate("Role" as never)} // if using TypeScript + strict navigation types
      >
        <Text style={styles.linkText}>Voir les rôles</Text>
      </TouchableOpacity>

      {identityDoc && (
        <Image
          source={{ uri: identityDoc.uri }}
          style={{ width: 100, height: 100, marginBottom: 16 }}
        />
      )}

      <Button title="Enregistrer les modifications" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 12,
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
    padding: 10,
    fontSize: 16,
  },
  identityButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  identityButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  roleButton: {
    backgroundColor: "#6c63ff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  linkText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default EditProfileForm;
