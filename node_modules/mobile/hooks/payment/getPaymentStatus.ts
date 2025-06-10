import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export function usePaymentStatus(paymentId: string) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  useEffect(() => {
    if (!paymentId) {
      setLoading(false);
      setStatus(null);
      return;
    }

    const fetchPaymentStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.warn("Aucun token trouvé");
          setLoading(false);
          setStatus(null);
          return;
        }

        const res = await fetch(`${API_URL}payment/${paymentId}/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error(
            "Erreur HTTP lors de la récupération du statut de paiement :",
            res.status
          );
          setStatus(null);
        } else {
          const data = await res.text(); // Le statut est renvoyé en texte brut
          setStatus(data);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du statut de paiement :",
          error
        );
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [paymentId]);

  return { status, loading };
}
