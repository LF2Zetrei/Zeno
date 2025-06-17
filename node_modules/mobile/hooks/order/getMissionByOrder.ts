import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export function useMissionByOrderId(orderId: string) {
  const [mission, setMission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setMission(null);
      return;
    }

    const fetchOrder = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setLoading(false);
          setMission(null);
          return;
        }
        console.log(`${API_URL}order/${orderId}`);
        const res = await fetch(`${API_URL}order/${orderId}/mission`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Erreur HTTP :", res.status);
          setMission(null);
        } else {
          const data = await res.json();
          setMission(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la mission :", error);
        setMission(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return { mission, loading };
}
