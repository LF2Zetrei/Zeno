import React from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useMessagesWithContact } from "../../hooks/message/useMessagesWithContact";
import CreateMessageForm from "../../components/CreateMessageForm";

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

        <CreateMessageForm receiverId={contactId} />
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
});
