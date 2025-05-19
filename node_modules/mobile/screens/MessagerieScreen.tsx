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

type Message = {
  id: string;
  sender: "user" | "contact";
  content: string;
};

export default function MessagerieScreen({ route }: any) {
  const { contactId, contactName } = route.params || {};
  if (!contactId) {
    // Par exemple, afficher un message ou retourner null
    return <Text>Contact non sélectionné</Text>;
  }

  // Exemple statique de messages par contact, tu peux remplacer par API ou base de données
  const initialMessages = {
    "1": [
      { id: "1", sender: "contact", content: "Bonjour ! Le colis est prêt." },
      { id: "2", sender: "user", content: "Génial, je peux passer demain ?" },
    ],
    "2": [
      {
        id: "3",
        sender: "contact",
        content: "Salut, tu as reçu le paiement ?",
      },
      { id: "4", sender: "user", content: "Oui, merci beaucoup." },
    ],
    "3": [
      { id: "5", sender: "contact", content: "Nouveau savon disponible !" },
    ],
  };

  const [messages, setMessages] = useState<Message[]>(
    initialMessages[contactId] || []
  );
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: newMessage.trim(),
    };

    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header local */}
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
