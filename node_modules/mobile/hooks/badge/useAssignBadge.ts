import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export function useAssignBadge() {
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  const assignBadge = async (badgeId: string): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.warn("Aucun token trouvé");
        return false;
      }

      const res = await fetch(`${API_URL}badge/assign/${badgeId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error(
          `Erreur HTTP lors de l'assignation du badge ${badgeId} :`,
          res.status
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de l'assignation du badge :", error);
      return false;
    }
  };

  return { assignBadge };
}
