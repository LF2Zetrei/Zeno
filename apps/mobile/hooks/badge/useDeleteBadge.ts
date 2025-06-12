import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export function useDeleteBadge() {
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  const deleteBadge = async (badgeId: string): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.warn("Aucun token trouvé");
        return false;
      }

      const res = await fetch(`${API_URL}badge/${badgeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error(
          `Erreur HTTP lors de la suppression du badge ${badgeId} :`,
          res.status
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du badge :", error);
      return false;
    }
  };

  return { deleteBadge };
}
