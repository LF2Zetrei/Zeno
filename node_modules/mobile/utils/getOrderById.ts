import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export async function getOrderById(orderId: string) {
  if (!orderId) return null;
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return null;

    const res = await fetch(`${API_URL}order/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const rawText = await res.text(); // 👈 on lit le texte brut
    console.log("Réponse brute :", rawText);

    if (!res.ok) {
      console.error("Erreur HTTP :", res.status);
      return null;
    }

    const data = JSON.parse(rawText); // 👈 on parse ensuite
    return data;
  } catch (error) {
    console.error("Erreur fetch order:", error);
    return null;
  }
}
