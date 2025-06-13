import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export function useRoleUpdate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  const updateUserRole = async (newRole: string): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("Token manquant");
        return;
      }

      const res = await fetch(
        `${API_URL}role?role=${encodeURIComponent(newRole)}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Erreur HTTP ${res.status} : ${res.statusText} - ${errorText}`
        );
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUserRole,
    loading,
    error,
    success,
  };
}
