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
import { MaterialIcons } from "@expo/vector-icons"; // Icône avion en papier

export default function ContactsScreen({ navigation }: any) {
  const { contacts, loading } = useContacts();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2f167f" />
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
              style={styles.contactNameContainer}
            >
              <Text style={styles.contactName}>{item.pseudo}</Text>
            </TouchableOpacity>

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.ratingButton}
                onPress={() =>
                  navigation.navigate("Rating", { userName: item.pseudo })
                }
              >
                <Text style={styles.ratingText}>Noter</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.messageButton}
                onPress={() =>
                  navigation.navigate("Messagerie", {
                    contactId: item.idUser,
                    contactName: item.pseudo,
                  })
                }
              >
                <MaterialIcons name="message" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8", // Fond gris clair
    paddingTop: 20,
  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3, // Ombre subtile pour l'effet de carte
    marginHorizontal: 20,
  },
  contactNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  contactName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2f167f", // Couleur primaire
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ratingButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#cb157c", // Bleu nuit
    borderRadius: 6,
    height: 48, // Même hauteur que le bouton Message
    justifyContent: "center", // Centrer le texte verticalement
    alignItems: "center", // Centrer le texte horizontalement
  },
  ratingText: {
    color: "#fff",
    fontWeight: "bold",
  },
  messageButton: {
    backgroundColor: "#cb157c", // Couleur bleu pour l'avion en papier
    borderRadius: 6,
    padding: 12, // Ajouter du padding pour ajuster la taille
    height: 48, // Même hauteur que le bouton Noter
    justifyContent: "center", // Centrer l'icône verticalement
    alignItems: "center", // Centrer l'icône horizontalement
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
});
