import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export async function getMissionByOrderId(orderId: string) {
  const API_URL = Constants.expoConfig?.extra?.apiUrl;
  console.log("[getMissionByOrderId] orderId:", orderId);
  console.log("[getMissionByOrderId] API_URL:", API_URL);

  if (!orderId || !API_URL) return null;

  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return null;

    const res = await fetch(`${API_URL}order/${orderId}/mission`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await res.text(); // ← pour voir la vraie réponse
    try {
      const data = JSON.parse(text);
      return data;
    } catch (err) {
      console.error("❌ JSON.parse error", err);
      console.error("❌ Contenu brut retourné :", text);
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la mission :", error);
    return null;
  }
}
