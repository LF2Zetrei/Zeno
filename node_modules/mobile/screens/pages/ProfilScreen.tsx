import React, { useState } from "react";
import { View, Text, Alert, ActivityIndicator, Button } from "react-native";
import { useUserByJwt } from "../../hooks/user/getUserByJwt";
import EditProfileForm from "../../components/form/EditProfilForm";

export default function ProfilScreen() {
  const { user, loading } = useUserByJwt();
  const [editMode, setEditMode] = useState(false); // ✅ Correction ici

  if (loading) return <ActivityIndicator />;
  if (!user) return <Text>Utilisateur non connecté</Text>;

  let subscription;

  if (user.basicSubscription) {
    subscription = <Text>Subscription : basic</Text>;
  } else if (user.premiumSubscription) {
    subscription = <Text>Subscription : premium</Text>;
  } else {
    subscription = <Text>Subscription : Plan gratuit</Text>;
  }

  const handleUpdate = (updatedUser: typeof user) => {
    console.log("Nouvelles données :", updatedUser);
    setEditMode(false);
    Alert.alert("Profil mis à jour !");
  };

  if (!editMode) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Profil utilisateur
        </Text>
        <Text>Email : {user.email}</Text>
        <Text>Pseudonyme : {user.pseudo}</Text>
        <Text>Nom : {user.lastName}</Text>
        <Text>Prénom : {user.firstName}</Text>
        <Text>Mot de passe : {user.password}</Text>
        <Text>Phone : {user.phone}</Text>
        <Text>Pays : {user.country}</Text>
        <Text>Adresse : {user.address}</Text>
        <Text>Code postal : {user.postalCode}</Text>
        {subscription}
        <Text>
          Inscrit depuis : {new Date(user.createdAt).toLocaleDateString()}
        </Text>
        <Button
          title="Modifier le profil"
          onPress={() => {
            setEditMode(true);
          }}
        />
      </View>
    );
  }

  return <EditProfileForm initialData={user} onSubmit={handleUpdate} />;
}
