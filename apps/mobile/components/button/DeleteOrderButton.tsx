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
import { useAuth } from "../../context/AuthContext";

const DeleteOrderButton = ({
  orderId,
  onDeleted,
}: {
  orderId: string;
  onDeleted?: () => void;
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDeleteOrder = () => {
    Alert.alert(
      "Supprimer la commande",
      "Es-tu sûr de vouloir supprimer cette commande ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const API_URL = Constants.expoConfig?.extra?.apiUrl;
              const response = await fetch(`${API_URL}order/${orderId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });

              if (!response.ok)
                throw new Error("Erreur lors de la suppression");

              if (onDeleted) onDeleted();
            } catch (error: any) {
              Alert.alert("Erreur", error.message);
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
      <Text style={styles.warning}>Cette action supprimera la commande.</Text>
      <Button
        title="Supprimer la commande"
        onPress={handleDeleteOrder}
        color="#d11a2a"
        disabled={loading}
      />
      {loading && <ActivityIndicator color="#d11a2a" />}
    </View>
  );
};

export default DeleteOrderButton;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  warning: {
    color: "#d11a2a",
    marginBottom: 5,
  },
});
