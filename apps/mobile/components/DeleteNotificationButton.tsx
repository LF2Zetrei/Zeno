import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";
import { useAuth } from "../context/AuthContext";

const DeleteNotificationButton = ({
  notificationId,
}: {
  notificationId: string;
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDeleteNotification = () => {
    Alert.alert("Supprimer la notification", "Confirmer la suppression ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            const API_URL = Constants.expoConfig?.extra?.apiUrl;
            const response = await fetch(
              `${API_URL}notification/${notificationId}`,
              {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (!response.ok) throw new Error("Échec de la suppression");

            Alert.alert("Notification supprimée");
          } catch (error: any) {
            Alert.alert("Erreur", error.message);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.warning}>Cette action est irréversible.</Text>
      <Button
        title="Supprimer la notification"
        onPress={handleDeleteNotification}
        color="#d11a2a"
        disabled={loading}
      />
      {loading && <ActivityIndicator color="#d11a2a" />}
    </View>
  );
};

export default DeleteNotificationButton;
