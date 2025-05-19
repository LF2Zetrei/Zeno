import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

type Contact = {
  id: string;
  name: string;
};

const contacts: Contact[] = [
  { id: "1", name: "Pierre" },
  { id: "2", name: "Marina" },
  { id: "3", name: "Luc" },
];

export default function ContactsScreen({ navigation }: any) {
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
});
