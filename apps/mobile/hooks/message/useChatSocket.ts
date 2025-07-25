import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client"; // ✅ à ajouter
import { useUserByJwt } from "../user/getUserByJwt";

export function useChatSocket(
  contactId: string,
  userId: string,
  token: string,
  onMessageReceived: (message: any) => void
) {
  const clientRef = useRef<Client | null>(null);
  const { user, loading } = useUserByJwt();
  useEffect(() => {
    if (!contactId || !userId || !token) {
      console.warn(
        "⛔ WebSocket non initialisé : contactId, userId ou token manquant"
      );
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS("http://192.168.1.14:8080/ws-native"), // ✅ SockJS ici
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log("[STOMP]", str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("✅ STOMP connecté");
        client.subscribe(`/user/${user?.pseudo}/queue/messages`, (message) => {
          try {
            const body = JSON.parse(message.body);
            console.log("📩 Message reçu :", body);
            onMessageReceived(body);
          } catch (err) {
            console.error("❌ Erreur parsing message", err);
          }
        });
      },
      onStompError: (frame) => {
        console.error("❌ STOMP error:", frame.headers["message"]);
      },
      onWebSocketClose: () => {
        console.warn("🔌 WebSocket fermé");
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
    };
  }, [contactId, userId, token, onMessageReceived]);
}
