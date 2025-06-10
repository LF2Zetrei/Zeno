import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export function useMessageById(messageId: string) {
  const [message, setMessage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  useEffect(() => {
    if (!messageId) {
      setLoading(false);
      setMessage(null);
      return;
    }

    const fetchMessage = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setLoading(false);
          setMessage(null);
          return;
        }

        const res = await fetch(`${API_URL}message/${messageId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Erreur HTTP :", res.status);
          setMessage(null);
        } else {
          const data = await res.json();
          setMessage(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du message :", error);
        setMessage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [messageId]);

  return { message, loading };
}
