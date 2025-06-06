// screens/ProfileEditScreen.tsx
import React from "react";
import { View, Alert, Text, ActivityIndicator, StyleSheet } from "react-native";
import EditProfileForm from "../components/EditProfilForm";
import { useUserByJwt } from "../hooks/user/getUserByJwt";

export default function EditProfilScreen() {
  const { user, loading } = useUserByJwt();

  if (loading) return <ActivityIndicator />;
  if (!user) return <Text>Utilisateur non connecté</Text>;

  const handleUpdate = (updatedUser: typeof user) => {
    console.log("Nouvelles données :", updatedUser);
    // 🔥 Ici tu peux faire un fetch PATCH/PUT vers ton backend
    Alert.alert("Profil mis à jour !");
  };

  return (
    <View style={styles.container}>
      <EditProfileForm initialData={user} onSubmit={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
});
