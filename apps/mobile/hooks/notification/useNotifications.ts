import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.warn("Aucun token trouvé");
          setNotifications([]);
          return;
        }

        const res = await fetch(`${API_URL}notification/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error(
            "Erreur HTTP lors de la récupération des notifications :",
            res.status
          );
          setNotifications([]);
        } else {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des notifications :",
          error
        );
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return { notifications, loading };
}
