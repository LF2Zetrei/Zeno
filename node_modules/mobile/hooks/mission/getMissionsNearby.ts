import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export function useNearbyMissions(radiusKm: number) {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.warn("Aucun token trouvé");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}nearby?radiusKm=${radiusKm}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const message = await res.text();
          setError(message || "Erreur serveur");
          setMissions([]);
        } else {
          const data = await res.json();
          setMissions(data);
        }
      } catch (err) {
        console.error("Erreur réseau :", err);
        setError("Erreur réseau");
        setMissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [radiusKm]);

  return { missions, loading, error };
}
