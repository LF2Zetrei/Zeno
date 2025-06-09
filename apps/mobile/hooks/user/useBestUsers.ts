import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export function useBestUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  useEffect(() => {
    const fetchBestUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}user/best`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Erreur HTTP :", res.status);
          setUsers([]);
        } else {
          const data = await res.json();
          setUsers(data.reverse());
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des meilleurs utilisateurs :",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBestUsers();
  }, []);

  return { users, loading };
}
