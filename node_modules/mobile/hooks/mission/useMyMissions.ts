import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export function useMyMissions() {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  useEffect(() => {
    const fetchMyMissions = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.warn("Aucun token trouvé");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}mission/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error(
            "Erreur HTTP lors de la récupération de vos missions :",
            res.status
          );
          setMissions([]);
        } else {
          const data = await res.json();
          setMissions(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des missions :", error);
        setMissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyMissions();
  }, []);

  return { missions, loading };
}
