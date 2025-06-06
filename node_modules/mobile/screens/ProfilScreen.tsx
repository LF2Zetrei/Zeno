import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useUserByJwt } from "../hooks/user/getUserByJwt";

export default function ProfilScreen() {
  const { user, loading } = useUserByJwt();

  if (loading) return <ActivityIndicator />;
  if (!user) return <Text>Utilisateur non connecté</Text>;

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Profil utilisateur
      </Text>
      <Text>Email : {user.email}</Text>
      <Text>Rôle : {user.role}</Text>
      <Text>
        Inscrit depuis : {new Date(user.createdAt).toLocaleDateString()}
      </Text>
      {/* Tu peux afficher d'autres champs comme user.address, user.phone, etc. */}
    </View>
  );
}
