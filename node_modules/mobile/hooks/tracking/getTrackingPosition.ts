import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

interface Position {
  latitude: number;
  longitude: number;
}

export function useTrackingPositions(missionId: string) {
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  useEffect(() => {
    const fetchTrackingPosition = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.warn("Aucun token trouvé");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}tracking/${missionId}/positions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error(
            `Erreur HTTP lors de la récupération des positions pour la mission ${missionId} :`,
            res.status
          );
          setPosition(null);
        } else {
          const data = await res.json();
          setPosition(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des positions :", error);
        setPosition(null);
      } finally {
        setLoading(false);
      }
    };

    if (missionId) {
      fetchTrackingPosition();
    }
  }, [missionId]);

  return { position, loading };
}
