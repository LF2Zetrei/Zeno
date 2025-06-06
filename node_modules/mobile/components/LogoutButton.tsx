import React from "react";
import { Button, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Oui",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return <Button title="Se déconnecter" onPress={handleLogout} />;
}
