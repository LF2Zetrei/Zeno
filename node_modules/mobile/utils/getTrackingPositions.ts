// utils/getTrackingPositionsByMissions.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

type Position = {
  latitude: number;
  longitude: number;
};

export async function getTrackingPositionsByMissions(missions: any[]) {
  const API_URL = Constants.expoConfig?.extra?.apiUrl;
  const token = await AsyncStorage.getItem("token");

  if (!API_URL || !token || !missions.length) return [];

  const positionsByMission = await Promise.all(
    missions.map(async (mission) => {
      try {
        const res = await fetch(
          `${API_URL}tracking/${mission.idMission}/positions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Erreur réseau");

        const data = await res.json();
        return { missionId: mission.idMission, positions: data };
      } catch (err) {
        console.error(
          `Erreur de tracking pour mission ${mission.idMission}:`,
          err
        );
        return { missionId: mission.idMission, positions: [] };
      }
    })
  );

  return positionsByMission;
}
