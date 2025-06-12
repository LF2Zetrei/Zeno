import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

type Position = {
  latitude: number;
  longitude: number;
};

export function useTrackingPositions(missionId: string) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  useEffect(() => {
    if (!missionId) {
      setLoading(false);
      setPositions([]);
      return;
    }

    const fetchPositions = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setError("Token manquant");
          setPositions([]);
          setLoading(false);
          return;
        }

        const url = `${API_URL}tracking/${missionId}/positions`;
        console.log("Fetching tracking positions from:", url);

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(
            `Erreur HTTP ${res.status} : ${res.statusText} - ${errorText}`
          );
        }

        const data: Position[] = await res.json();
        setPositions(data);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
        setPositions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, [missionId]);

  return { positions, loading, error };
}
