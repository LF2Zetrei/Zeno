import React, { useState, useEffect, useRef } from "react";
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
import { useChatSocket } from "../../hooks/message/useChatSocket";
import { useUserByJwt } from "../../hooks/user/getUserByJwt";

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
  const {
    messages,
    loading: messagesLoading,
    refetch,
  } = useMessagesWithContact(contactId);
  const { token } = useAuth();
  const { user, loading: userLoading } = useUserByJwt();
  const API_URL = Constants.expoConfig?.extra?.apiUrl;
  const [content, setContent] = useState("");

  const [displayedMessages, setDisplayedMessages] = useState<any[]>([]);

  // Ref pour scroller au dernier message
  const flatListRef = useRef<FlatList>(null);

  // Sync messages initialement
  useEffect(() => {
    if (!messagesLoading && messages) {
      setDisplayedMessages(messages);
    }
  }, [messagesLoading, messages]);

  // Message reçu via WebSocket
  const handleIncomingMessage = (newMessage: any) => {
    console.log("📩 Message reçu via WebSocket :", newMessage);
    setDisplayedMessages((prev) => [...prev, newMessage]);
  };

  console.log("contactId:", contactId);
  console.log("token:", token);
  console.log("user:", user);

  useChatSocket(contactId, user?.idUser, token, handleIncomingMessage);

  // Scroll vers le dernier message quand displayedMessages change
  useEffect(() => {
    if (displayedMessages.length && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [displayedMessages]);

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

      setContent("");
      refetch();
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Erreur réseau.");
    }
  };

  if (!contactId) return <Text>Contact non sélectionné</Text>;
  if (userLoading) return <ActivityIndicator size="large" color="#2196F3" />;

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
        {messagesLoading ? (
          <ActivityIndicator size="large" color="#2196F3" />
        ) : (
          <FlatList
            ref={flatListRef}
            data={displayedMessages}
            keyExtractor={(item) =>
              item.id?.toString() ||
              item.idMessage?.toString() ||
              Math.random().toString()
            }
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
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
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
