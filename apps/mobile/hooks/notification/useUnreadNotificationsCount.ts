import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export function useUnreadNotificationCount() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  useEffect(() => {
    const fetchUnreadCount = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.warn("Aucun token trouvé");
          setCount(0);
          return;
        }

        const res = await fetch(`${API_URL}notification/user/unread-count`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error(
            "Erreur HTTP pour le count des notifications :",
            res.status
          );
          setCount(0);
        } else {
          const data = await res.json();
          setCount(data);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du nombre de notifications non lues :",
          error
        );
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadCount();
  }, []);

  return { count, loading };
}
