import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export function useOrderStatus(orderId: string) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setStatus(null);
      return;
    }

    const fetchStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setLoading(false);
          setStatus(null);
          return;
        }

        const res = await fetch(`${API_URL}order/${orderId}/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Erreur HTTP :", res.status);
          setStatus(null);
        } else {
          const data = await res.text(); // le status est une string brute
          setStatus(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du statut :", error);
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [orderId]);

  return { status, loading };
}
