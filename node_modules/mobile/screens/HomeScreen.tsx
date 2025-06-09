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
import BestUsersList from "../components/BestUsersList";
import ProductList from "../components/ProductsList";

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
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Actions :</Text>
        <TouchableOpacity onPress={() => navigation.navigate("EditProfil")}>
          <Text style={styles.linkText}>Éditer mon profil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Sub")}>
          <Text style={styles.linkText}>Gérer mon abonnement</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Rate")}>
          <Text style={styles.linkText}>Noter quelqu’un</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Delete")}>
          <Text style={styles.linkText}>Supprimer mon profil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("CreateProduct")}>
          <Text style={styles.linkText}>Créer un produit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("EditProduct")}>
          <Text style={styles.linkText}>Editer un produit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("DeleteProduct")}>
          <Text style={styles.linkText}>Supprimer un produit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("CreateOrder")}>
          <Text style={styles.linkText}>Créer une commande</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Classement :</Text>
        <ProductList />
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
