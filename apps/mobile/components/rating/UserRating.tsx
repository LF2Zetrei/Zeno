import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import Constants from "expo-constants";

// Icône simple d'étoile (peut être remplacée par une librairie comme react-native-vector-icons)
const Star = ({
  filled,
  onPress,
}: {
  filled: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={{ fontSize: 32, color: filled ? "#FFD700" : "#ccc" }}>★</Text>
  </TouchableOpacity>
);

const UserRating = ({ userName }: { userName: string }) => {
  const { token } = useAuth();
  const [rating, setRating] = useState(0); // note sélectionnée
  const [loading, setLoading] = useState(false);

  const submitRating = async (selectedRating: number) => {
    setRating(selectedRating);
    setLoading(true);
    const API_URL = Constants.expoConfig?.extra?.apiUrl;

    try {
      const formBody = `rate=${selectedRating}&userName=${encodeURIComponent(
        userName
      )}`;

      const response = await fetch(`${API_URL}user/rate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: formBody,
      });

      if (!response.ok) {
        throw new Error("Impossible d’envoyer la note");
      }

      Alert.alert(
        "Succès",
        `Vous avez noté ${userName} ${selectedRating} étoile(s).`
      );
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Noter {userName}</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            filled={value <= rating}
            onPress={() => submitRating(value)}
          />
        ))}
      </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 8,
  },
});

export default UserRating;
