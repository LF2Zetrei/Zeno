import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useRoleUpdate } from "../../hooks/user/useUserRole";
import { COLORS } from "../../styles/color";

const StatusSelector = () => {
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [selectedRole, setSelectedRole] = useState<"USER" | "DELIVER" | null>(
    null
  );

  const { updateUserRole, loading, error, success } = useRoleUpdate();
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_URL}user/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Impossible de récupérer le rôle");

        const userData = await res.json();
        setCurrentRole(userData?.role || null);
        setSelectedRole(userData?.role || null); // par défaut sélectionne le rôle actuel
      } catch (err: any) {
        Alert.alert("Erreur", err.message || "Une erreur est survenue");
      } finally {
        setLoadingRole(false);
      }
    };

    fetchRole();
  }, []);

  const handleRoleChange = async (newRole: "USER" | "DELIVER") => {
    if (newRole === currentRole) return;

    Alert.alert(
      "Confirmation",
      `Voulez-vous changer votre rôle pour "${newRole}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: async () => {
            const token = await AsyncStorage.getItem("token");

            try {
              const res = await fetch(`${API_URL}user/role?role=${newRole}`, {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              const data = await res.json();

              if (res.ok) {
                setCurrentRole(newRole);
                setSelectedRole(newRole);
                Alert.alert(
                  "Succès",
                  data.message || "Changement de rôle effectué"
                );

                // Si on a un lien d'onboarding Stripe
                if (data.onboardingUrl) {
                  console.log("Lien Stripe : ", data.onboardingUrl);
                  Linking.openURL(data.onboardingUrl);
                }
              } else {
                Alert.alert(
                  "Erreur",
                  data.error || "Impossible de changer le rôle"
                );
              }
            } catch (err: any) {
              Alert.alert("Erreur", err.message || "Une erreur est survenue");
            }
          },
        },
      ]
    );
  };

  if (loadingRole) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primaryBlue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sélection du rôle</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.roleBox,
            { backgroundColor: COLORS.primaryBlue },
            selectedRole === "USER"
              ? styles.selectedRoleBox
              : styles.unselectedRoleBox,
          ]}
          onPress={() => setSelectedRole("USER")}
          activeOpacity={0.7}
        >
          <Text style={styles.roleTitle}>Rôle USER</Text>
          <Text style={styles.roleDescription}>
            Pour acheter ou demander des produits.
          </Text>
          {currentRole === "USER" && (
            <Text style={styles.currentRoleLabel}>Rôle actuel</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleBox,
            { backgroundColor: COLORS.primaryPink },
            selectedRole === "DELIVER"
              ? styles.selectedRoleBox
              : styles.unselectedRoleBox,
          ]}
          onPress={() => setSelectedRole("DELIVER")}
          activeOpacity={0.7}
        >
          <Text style={styles.roleTitle}>Rôle DELIVER</Text>
          <Text style={styles.roleDescription}>
            Pour livrer des produits aux utilisateurs.
          </Text>
          {currentRole === "DELIVER" && (
            <Text style={styles.currentRoleLabel}>Rôle actuel</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtonContainer}>
        <Button
          title={`Changer pour ${selectedRole || "..."}`}
          onPress={() => selectedRole && handleRoleChange(selectedRole)}
          disabled={loading || !selectedRole || selectedRole === currentRole}
          color={COLORS.primaryYellow}
        />
      </View>

      {loading && <ActivityIndicator size="large" color={COLORS.primaryBlue} />}
    </View>
  );
};
const styles = StyleSheet.create({
  activeRoleBox: {
    borderWidth: 3,
    borderColor: "#fff",
    opacity: 1,
  },
  currentRoleLabel: {
    marginTop: 10,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  container: {
    padding: 24,
    gap: 16,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.primaryBlue,
  },
  info: {
    fontSize: 14,
    textAlign: "center",
    color: COLORS.secondaryOlive,
    marginBottom: 8,
  },
  roleText: {
    fontWeight: "bold",
    color: COLORS.primaryBlue,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginVertical: 20,
  },
  roleBox: {
    padding: 20,
    borderRadius: 10,
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.9,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  unselectedRoleBox: {
    opacity: 0.5,
    transform: [{ scale: 0.9 }],
    // pour faire un effet grisé, on peut aussi appliquer un filtre de couleur via une vue en overlay,
    // mais ici opacity suffit pour simplifier
  },
});

export default StatusSelector;
