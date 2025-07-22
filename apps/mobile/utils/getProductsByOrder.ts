import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

/**
 * Récupère les produits associés à une commande donnée
 * @param orderId ID de la commande
 * @returns Un tableau de produits ou null en cas d'erreur
 */
export async function getProductsByOrder(orderId: string) {
  if (!orderId) return null;

  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.warn("Token non trouvé");
      return null;
    }

    const res = await fetch(`${API_URL}order/${orderId}/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const rawText = await res.text();
    console.log("Réponse produits (brute) :", rawText);

    if (!res.ok) {
      console.error(`Erreur HTTP : ${res.status}`);
      return null;
    }

    const data = JSON.parse(rawText);
    return data;
  } catch (error) {
    console.error("Erreur lors du fetch des produits :", error);
    return null;
  }
}
