// components/CustomHeader.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const pages = [
  { label: "Accueil", screen: "Accueil" },
  { label: "Connexion", screen: "Connexion" },
  { label: "Inscription", screen: "Inscription" },
  { label: "Créer mission", screen: "CreerMissions" },
  { label: "Voir missions", screen: "ListeMissions" },
  { label: "Carte", screen: "CarteMissions" },
  { label: "Contact", screen: "Contacts" },
];

export default function CustomHeader({ title }: { title: string }) {
  const navigation = useNavigation<any>();
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [notifVisible, setNotifVisible] = React.useState(false);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => setMenuVisible(true)}>
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>ZENO</Text>

      <TouchableOpacity onPress={() => setNotifVisible(true)}>
        <Ionicons name="notifications" size={26} color="black" />
      </TouchableOpacity>

      {/* Menu Modal */}
      <Modal transparent visible={menuVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Menu</Text>
            {pages.map((page) => (
              <TouchableOpacity
                key={page.screen}
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate(page.screen);
                }}
                style={styles.menuItem}
              >
                <Text style={styles.menuText}>{page.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setMenuVisible(false)}>
              <Text style={styles.close}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal transparent visible={notifVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.notifContainer}>
            <Text style={styles.menuTitle}>Notifications</Text>
            {/* Exemple de notifications */}
            <FlatList
              data={[{ id: "1", text: "Nouvelle mission disponible !" }]}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Text style={styles.menuText}>• {item.text}</Text>
              )}
            />
            <TouchableOpacity onPress={() => setNotifVisible(false)}>
              <Text style={styles.close}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  notifContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "60%",
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
  },
  close: {
    marginTop: 20,
    color: "blue",
    fontSize: 16,
    textAlign: "center",
  },
});
