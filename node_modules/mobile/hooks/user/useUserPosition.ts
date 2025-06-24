import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

type UserPositionResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  latitude?: number;
  longitude?: number;
  // ajoute d'autres champs si nécessaire selon la structure de ton User
};

export function useUpdateUserPosition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserPositionResponse | null>(null);

  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  const updatePosition = async (
    latitude: number,
    longitude: number
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    setUser(null);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("Token manquant");
        return;
      }

      const response = await fetch(
        `${API_URL}position?latitude=${latitude}&longitude=${longitude}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Erreur HTTP ${response.status} : ${response.statusText} - ${errorText}`
        );
      }

      const data: UserPositionResponse = await response.json();
      setUser(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    updatePosition,
    loading,
    error,
    user,
  };
}
