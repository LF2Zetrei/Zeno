import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export function useOrderById(orderId: string) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setOrder(null);
      return;
    }

    const fetchOrder = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setLoading(false);
          setOrder(null);
          return;
        }
        console.log(`${API_URL}order/${orderId}`);
        const res = await fetch(`${API_URL}order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Erreur HTTP :", res.status);
          setOrder(null);
        } else {
          const data = await res.json();
          setOrder(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la commande :", error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return { order, loading };
}
