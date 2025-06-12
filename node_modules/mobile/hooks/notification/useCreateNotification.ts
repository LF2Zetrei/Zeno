import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

type NotificationParams = {
  receiverId: string;
  title: string;
  message: string;
};

type NotificationResponse = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
};

export function useCreateNotification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationResponse | null>(
    null
  );

  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  const createNotification = async ({
    receiverId,
    title,
    message,
  }: NotificationParams) => {
    setLoading(true);
    setError(null);
    setNotification(null);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Token manquant");
      }

      const body = new URLSearchParams({
        title,
        message,
      }).toString();

      const response = await fetch(`${API_URL}notification/${receiverId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP ${response.status} : ${errorText}`);
      }

      const data: NotificationResponse = await response.json();
      setNotification(data);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return {
    createNotification,
    loading,
    error,
    notification,
  };
}
