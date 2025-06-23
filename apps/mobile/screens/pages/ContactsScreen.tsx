import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useContacts } from "../../hooks/message/getContacts";

export default function ContactsScreen({ navigation }: any) {
  const { contacts, loading } = useContacts();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.idUser}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Messagerie", {
                  contactId: item.idUser,
                  contactName: item.pseudo,
                })
              }
            >
              <Text style={styles.contactName}>{item.pseudo}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ratingButton}
              onPress={() =>
                navigation.navigate("Rating", { userName: item.pseudo })
              }
            >
              <Text style={styles.ratingText}>Noter</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  contactName: {
    fontSize: 18,
  },
  ratingButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#007bff",
    borderRadius: 6,
  },
  ratingText: {
    color: "#fff",
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
