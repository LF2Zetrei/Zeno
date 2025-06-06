// screens/HomeScreen.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import LogoutButton from "../components/LogoutButton";
type Props = NativeStackScreenProps<RootStackParamList, "Accueil">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur la page d'accueil !</Text>

      <View style={styles.linkContainer}>
        <Text>Mon profil </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profil")}>
          <Text style={styles.linkText}>clique ici !</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.linkContainer}>
        <Text>Editer mon profil </Text>
        <TouchableOpacity onPress={() => navigation.navigate("EditProfil")}>
          <Text style={styles.linkText}>clique ici !</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Sub")}>
          <Text style={styles.linkText}>Gérer mon abonnement</Text>
        </TouchableOpacity>
      </View>
      <LogoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
