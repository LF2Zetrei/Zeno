import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useRoleUpdate } from "../hooks/user/useUserRole";

const StatusSelector = () => {
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

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
      } catch (err) {
        Alert.alert("Erreur", err.message || "Une erreur est survenue");
      } finally {
        setLoadingRole(false);
      }
    };

    fetchRole();
  }, []);

  const handleRoleChange = (newRole: "USER" | "DELIVER") => {
    Alert.alert(
      "Confirmation",
      `Voulez-vous changer votre rôle pour "${newRole}" ?`,
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Confirmer",
          onPress: async () => {
            await updateUserRole(newRole);
            setCurrentRole(newRole);
          },
        },
      ]
    );
  };

  if (loadingRole) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sélection du rôle</Text>

      <Text style={styles.info}>
        Rôle actuel :{" "}
        <Text style={styles.roleText}>{currentRole || "Inconnu"}</Text>
      </Text>

      {currentRole !== "USER" && (
        <Button
          title="Passer en USER"
          onPress={() => handleRoleChange("USER")}
        />
      )}

      {currentRole !== "DELIVER" && (
        <Button
          title="Passer en DELIVER"
          onPress={() => handleRoleChange("DELIVER")}
        />
      )}

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {error && <Text style={styles.error}>Erreur : {error}</Text>}

      {success && (
        <Text style={styles.success}>
          Changement de rôle effectué avec succès
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  info: {
    fontSize: 16,
    textAlign: "center",
  },
  roleText: {
    fontWeight: "bold",
    color: "#007aff",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  success: {
    color: "green",
    textAlign: "center",
  },
});

export default StatusSelector;
