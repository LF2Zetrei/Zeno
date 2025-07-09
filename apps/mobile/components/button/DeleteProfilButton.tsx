import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import Constants from "expo-constants";

const DeleteProfileButton = () => {
  const { token, logout } = useAuth(); // on peut appeler logout() après suppression
  const [loading, setLoading] = useState(false);

  const handleDeleteProfile = async () => {
    Alert.alert(
      "Confirmation",
      "Es-tu sûr de vouloir supprimer ton profil ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            const API_URL = Constants.expoConfig?.extra?.apiUrl;

            try {
              const response = await fetch(`${API_URL}user/delete`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!response.ok) {
                throw new Error("Échec de la suppression du profil");
              }

              Alert.alert("Succès", "Ton profil a bien été supprimé.");
              logout?.(); // déconnecter l'utilisateur si la fonction est dispo
            } catch (error: any) {
              Alert.alert("Erreur", error.message || "Une erreur est survenue");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.warning}>
        Cette action supprimera définitivement ton compte.
      </Text>
      <Button
        title="Supprimer mon profil"
        onPress={handleDeleteProfile}
        color="#d11a2a"
        disabled={loading}
      />
      {loading && <ActivityIndicator size="large" color="#d11a2a" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
    alignItems: "center",
  },
  warning: {
    fontSize: 14,
    color: "#d11a2a",
    textAlign: "center",
  },
});

export default DeleteProfileButton;
