import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import LogoutButton from "../../components/LogoutButton";

type Props = NativeStackScreenProps<RootStackParamList, "Accueil">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenue sur la page d'accueil !</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Mon profil :</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profil")}>
          <Text style={styles.linkText}>Voir mon profil</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Les missions :</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Missions")}>
          <Text style={styles.linkText}>Voir les missions</Text>
        </TouchableOpacity>
        <Text style={styles.label}>La carte :</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Map")}>
          <Text style={styles.linkText}>Voir la carte des missons</Text>
        </TouchableOpacity>
      </View>

      <LogoutButton />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  linkText: {
    color: "#007AFF",
    marginVertical: 4,
    fontSize: 15,
  },
});
