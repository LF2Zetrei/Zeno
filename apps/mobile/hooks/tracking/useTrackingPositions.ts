import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

type TrackingResponse = {
  id: string;
  missionId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
};

export function useTrackingPositions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tracking, setTracking] = useState<TrackingResponse | null>(null);

  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  const updateTracking = async (
    missionId: string,
    latitude: number,
    longitude: number
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    setTracking(null);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("Token manquant");
        return;
      }

      const res = await fetch(
        `${API_URL}tracking/update?missionId=${encodeURIComponent(
          missionId
        )}&latitude=${latitude}&longitude=${longitude}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Erreur HTTP ${res.status} : ${res.statusText} - ${errorText}`
        );
      }

      const data: TrackingResponse = await res.json();
      setTracking(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateTracking,
    loading,
    error,
    tracking,
  };
}
