import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

type Contact = {
  id: string;
  name: string;
};

const BASE_URL = "http://localhost:8080/api/message/contacts";

// Remplace ce token par celui obtenu lors de la connexion
const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0ODc4NDc0OCwiZXhwIjoxNzQ4Nzg4MzQ4fQ.SLOd7NX30xHlFrmCzp8bP7fGagD3DfKTLCAeGYE-slY";

export default function ContactsScreen({ navigation }: any) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch(BASE_URL, {
        headers: {
          Authorization: TOKEN,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des contacts");
      }

      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Erreur fetchContacts:", error);
    } finally {
      setLoading(false);
    }
  };

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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() =>
              navigation.navigate("Messagerie", {
                contactId: item.id,
                contactName: item.name,
              })
            }
          >
            <Text style={styles.contactName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contactItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  contactName: {
    fontSize: 18,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
