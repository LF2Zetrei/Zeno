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
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Pour l'icône de l'avion en papier
import { useMessagesWithContact } from "../../hooks/message/useMessagesWithContact";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const { messages, loading } = useMessagesWithContact(contactId);

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

        {/* Ajout d'un paddingBottom ici pour laisser de l'espace */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Écrivez un message"
            multiline
          />
          <TouchableOpacity style={styles.sendButton}>
            <MaterialIcons name="send" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    backgroundColor: "#2f167f", // primaryBlue
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  wrapper: {
    flex: 1,
  },
  messageList: {
    padding: 10,
    paddingBottom: 120, // Augmenter ce paddingBottom pour laisser de l'espace en bas
  },
  messageContainer: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: "#DCF8C6", // Couleur verte pour les messages utilisateurs
    alignSelf: "flex-end",
  },
  contactMessage: {
    backgroundColor: "#F1F0F0", // Couleur grise pour les messages contact
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
    backgroundColor: "#f4f4f8", // card
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
    backgroundColor: "#2f167f", // primaryBlue
    borderRadius: 50,
    padding: 10,
    marginLeft: 10,
  },
});
