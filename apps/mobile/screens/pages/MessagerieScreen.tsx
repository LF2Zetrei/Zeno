import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useMessagesWithContact } from "../../hooks/message/useMessagesWithContact";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import Constants from "expo-constants";
import { useState } from "react";

type Props = {
  route: {
    params: {
      contactId: string;
      contactName: string;
    };
  };
};

export default function MessagerieScreen({ route }: Props) {
  const { contactId, contactName } = route.params || {};
  const { messages, loading, refetch } = useMessagesWithContact(contactId);
  const { token } = useAuth();
  const API_URL = Constants.expoConfig?.extra?.apiUrl;
  const [content, setContent] = useState("");

  const handleSend = async () => {
    if (!content.trim()) return;

    try {
      const res = await fetch(`${API_URL}message/${contactId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `content=${encodeURIComponent(content)}`,
      });

      if (!res.ok) {
        const error = await res.text();
        Alert.alert("Erreur", error || "Échec de l'envoi du message.");
        return;
      }

      setContent(""); // Clear input
      refetch(); // 🔄 Recharger les messages
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Erreur réseau.");
    }
  };

  if (!contactId) return <Text>Contact non sélectionné</Text>;

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
        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" />
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageContainer,
                  item.senderPseudo === contactName
                    ? styles.contactMessage
                    : styles.userMessage,
                ]}
              >
                <Text style={styles.messageText}>{item.content}</Text>
              </View>
            )}
            contentContainerStyle={styles.messageList}
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Écrivez un message"
            multiline
            value={content}
            onChangeText={setContent}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <MaterialIcons name="send" size={30} color="#fff" />
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
    backgroundColor: "#2f167f",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  wrapper: { flex: 1 },
  messageList: {
    padding: 10,
    paddingBottom: 120,
  },
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f4f4f8",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  messageInput: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#2f167f",
    borderRadius: 50,
    padding: 10,
    marginLeft: 10,
  },
});
