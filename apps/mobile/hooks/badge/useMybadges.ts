import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export function useMyBadges() {
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.warn("Aucun token trouvé");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}badge/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error(
            "Erreur HTTP lors de la récupération des badges :",
            res.status
          );
          setBadges([]);
        } else {
          const data = await res.json();
          setBadges(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des badges :", error);
        setBadges([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  return { badges, loading };
}
