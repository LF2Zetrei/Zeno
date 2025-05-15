import React from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Accueil">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue 👋</Text>
      <Image
        source={{ uri: "https://placekitten.com/400/250" }}
        style={styles.image}
      />
      <Button
        title="Voir les détails"
        onPress={() => navigation.navigate("Détails")}
      />
      <Button
        title="Se connecter"
        onPress={() => navigation.navigate("Connexion")}
      />
      <Button
        title="S'inscrire"
        onPress={() => navigation.navigate("Inscription")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
});
