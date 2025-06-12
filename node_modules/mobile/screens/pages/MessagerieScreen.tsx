import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
} from "react-native";

// Types
type Message = {
  id: string;
  sender: "user" | "contact";
  content: string;
};

// ✅ Base URL et token (à adapter dynamiquement si besoin)
const BASE_URL = "http://192.168.0.20:8080/api";
const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0ODc4NDc0OCwiZXhwIjoxNzQ4Nzg4MzQ4fQ.SLOd7NX30xHlFrmCzp8bP7fGagD3DfKTLCAeGYE-slY";

export default function MessagerieScreen({ route }: any) {
  const { contactId, contactName } = route.params || {};
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  if (!contactId) {
    return <Text>Contact non sélectionné</Text>;
  }

  // ✅ Récupération des messages au chargement
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/message/me/contact/${contactId}`,
          {
            method: "GET",
            headers: {
              Authorization: TOKEN,
            },
          }
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Erreur lors du fetch des messages :", error);
      }
    };

    fetchMessages();
  }, [contactId]);

  // ✅ Envoi d'un message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`${BASE_URL}/message/${contactId}`, {
        method: "POST",
        headers: {
          Authorization: TOKEN,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `content=${encodeURIComponent(newMessage.trim())}`,
      });

      if (response.ok) {
        const createdMessage = await response.json();
        setMessages((prev) => [...prev, createdMessage]);
        setNewMessage("");
      } else {
        console.error("Échec de l'envoi du message");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conversation avec {contactName}</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                item.sender === "user"
                  ? styles.userMessage
                  : styles.contactMessage,
              ]}
            >
              <Text style={styles.messageText}>{item.content}</Text>
            </View>
          )}
          contentContainerStyle={styles.messageList}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Écrire un message..."
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendText}>Envoyer</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    padding: 16,
    backgroundColor: "#2196F3",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  wrapper: { flex: 1 },
  messageList: { padding: 10, paddingBottom: 80 },
  messageContainer: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  contactMessage: {
    backgroundColor: "#F1F0F0",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
    width: "100%",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#2196F3",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
