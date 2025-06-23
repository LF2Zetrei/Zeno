import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export async function getMissionByOrderId(orderId: string) {
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  if (!orderId || !API_URL) return null;

  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return null;

    const res = await fetch(`${API_URL}order/${orderId}/mission`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Erreur HTTP :", res.status);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la mission :", error);
    return null;
  }
}
