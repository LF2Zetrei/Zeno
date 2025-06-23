import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

export default function HeaderLayout({ title }: { title: string }) {
  const navigation = useNavigation();
  const { token, logout } = useAuth();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      >
        <Text style={styles.burger}>☰</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {token ? (
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Déconnexion</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.authButtons}>
          <TouchableOpacity onPress={() => navigation.navigate("Connexion")}>
            <Text style={styles.authText}>Connexion</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.authText}>Inscription</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  burger: {
    fontSize: 26,
    color: "white",
  },
  title: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  logout: {
    color: "white",
    fontSize: 14,
  },
  authButtons: {
    flexDirection: "row",
    gap: 10,
  },
  authText: {
    color: "white",
    marginLeft: 10,
    fontSize: 14,
  },
});
