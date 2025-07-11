import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import { COLORS } from "../../styles/color"; // 🔥 utilise ta charte

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

  const validateIdentityWithAPI = async () => {
    try {
      const response = await fetch(`${API_URL}user/validate-identity`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour du statut d'identité.");
      }

      Alert.alert("Succès", "Identité vérifiée avec succès !");
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Impossible de valider.");
    }
  };

  const handleStripeIdentityVerification = async () => {
    try {
      const response = await fetch(`${API_URL}stripe/identity-session`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Impossible de démarrer la vérification d'identité.");
      }

      const data = await response.json();
      const identityUrl = data.url;

      await WebBrowser.openBrowserAsync(identityUrl);
      await validateIdentityWithAPI();
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Échec de la vérification.");
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}user/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
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
        onPress={handleStripeIdentityVerification}
      >
        <Text style={styles.identityButtonText}>
          Vérifier ma pièce d’identité via Stripe
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.roleButton}
        onPress={() => navigation.navigate("Role" as never)}
      >
        <Text style={styles.linkText}>Voir les rôles</Text>
      </TouchableOpacity>

      {identityDoc && (
        <Image
          source={{ uri: identityDoc.uri }}
          style={{ width: 100, height: 100, marginBottom: 16 }}
        />
      )}

      <View style={styles.buttonWrapper}>
        <Button
          title="Enregistrer les modifications"
          onPress={handleSubmit}
          color={COLORS.primaryBlue}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    backgroundColor: COLORS.background,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primaryBlue,
    alignSelf: "center",
    marginBottom: 16,
  },
  inputContainer: {
    gap: 6,
  },
  label: {
    fontWeight: "500",
    color: COLORS.dark,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.primaryBlue,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.card,
  },
  identityButton: {
    backgroundColor: COLORS.primaryPink,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  identityButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  roleButton: {
    backgroundColor: COLORS.secondaryOlive,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  linkText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonWrapper: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default EditProfileForm;
