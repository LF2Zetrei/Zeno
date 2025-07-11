import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useUserByJwt } from "../../hooks/user/getUserByJwt";
import EditProfileForm from "../../components/form/EditProfilForm";

export default function ProfilScreen() {
  const { user, loading } = useUserByJwt();
  const [editMode, setEditMode] = useState(false);

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2f167f" />
      </View>
    );

  if (!user)
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Utilisateur non connecté</Text>
      </View>
    );

  const subscription = user.premiumSubscription
    ? "Premium"
    : user.basicSubscription
    ? "Basique"
    : "Gratuit";

  const handleUpdate = (updatedUser: typeof user) => {
    console.log("Nouvelles données :", updatedUser);
    setEditMode(false);
    Alert.alert("Profil mis à jour !");
  };

  if (editMode) {
    return <EditProfileForm initialData={user} onSubmit={handleUpdate} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mon profil</Text>

      <View style={styles.card}>
        <ProfileLine label="Email" value={user.email} />
        <ProfileLine label="Pseudonyme" value={user.pseudo} highlight="pink" />
        <ProfileLine label="Nom" value={user.lastName} />
        <ProfileLine label="Prénom" value={user.firstName} />
        <ProfileLine label="Mot de passe" value="********" />
        <ProfileLine label="Téléphone" value={user.phone} />
        <ProfileLine label="Pays" value={user.country} />
        <ProfileLine label="Adresse" value={user.address} />
        <ProfileLine label="Code postal" value={user.postalCode} />
        <ProfileLine
          label="Abonnement"
          value={subscription}
          highlight="yellow"
        />
        <ProfileLine
          label="Inscrit depuis"
          value={new Date(user.createdAt).toLocaleDateString()}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => setEditMode(true)}>
        <Text style={styles.buttonText}>Modifier le profil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function ProfileLine({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "pink" | "yellow";
}) {
  const valueStyle = [
    styles.value,
    highlight === "pink" && { color: "#cb157c" },
    highlight === "yellow" && { color: "#ffb01b", fontWeight: "bold" },
  ];
  return (
    <View style={styles.line}>
      <Text style={styles.label}>{label} :</Text>
      <Text style={valueStyle}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // background
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2f167f", // primaryBlue
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f4f4f8", // card
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 30,
  },
  line: {
    marginBottom: 14,
  },
  label: {
    fontWeight: "600",
    color: "#869962", // secondaryOlive
    marginBottom: 4,
    fontSize: 14,
  },
  value: {
    color: "#050212", // dark
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2f167f", // primaryBlue
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 40, // pour espace avec bas d’écran
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 16,
    color: "#cb157c", // primaryPink
  },
});
