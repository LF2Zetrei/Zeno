import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export function useMessagesWithContact(contactId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.warn("Aucun token trouvé");
        setMessages([]);
        return;
      }

      const res = await fetch(`${API_URL}message/contact/${contactId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error(`Erreur HTTP : ${res.status}`);
        setMessages([]);
      } else {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contactId) {
      fetchMessages();
    }
  }, [contactId]);

  return { messages, loading, refetch: fetchMessages };
}
