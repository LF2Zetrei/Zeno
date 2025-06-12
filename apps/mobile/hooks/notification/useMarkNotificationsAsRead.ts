import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export function useMarkNotificationAsRead() {
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  const markAsRead = async (notificationId: string): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.warn("Aucun token trouvé");
        return false;
      }

      const res = await fetch(`${API_URL}notification/${notificationId}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error(
          `Erreur HTTP pour marquer comme lue la notification ${notificationId} :`,
          res.status
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error(
        "Erreur lors du marquage de la notification comme lue :",
        error
      );
      return false;
    }
  };

  return { markAsRead };
}
