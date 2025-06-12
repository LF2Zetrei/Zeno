import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export function useMessagesWithContact(contactId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  useEffect(() => {
    if (!contactId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.warn("Aucun token trouvé");
          setMessages([]);
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}message/contact/${contactId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error(
            `Erreur HTTP lors de la récupération des messages du contact ${contactId} :`,
            res.status
          );
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

    fetchMessages();
  }, [contactId]);

  return { messages, loading };
}
