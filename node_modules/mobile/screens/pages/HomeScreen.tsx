// screens/HomeScreen.tsx
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import NavigationCard from "../components/NavigationCard";
import CustomHeader from "../components/CustomHeader";
import LayoutWithHeader from "../components/LayoutWithHeader";
type Props = NativeStackScreenProps<RootStackParamList, "Accueil">;

const cards = [
  {
    title: "Voir les détails",
    image: "https://placekitten.com/400/200",
    screen: "Détails",
  },
  {
    title: "Se connecter",
    image: "https://placekitten.com/401/200",
    screen: "Connexion",
  },
  {
    title: "S'inscrire",
    image: "https://placekitten.com/402/200",
    screen: "Inscription",
  },
  {
    title: "Ajouter une mission",
    image: "https://placekitten.com/403/200",
    screen: "CreerMissions",
  },
  {
    title: "Voir les missions",
    image: "https://placekitten.com/404/200",
    screen: "ListeMissions",
  },
  {
    title: "Carte des missions",
    image: "https://placekitten.com/405/200",
    screen: "CarteMissions",
  },
  {
    title: "Contact",
    image: "https://placekitten.com/405/200",
    screen: "Contacts",
  },
];

export default function HomeScreen({ navigation }: Props) {
  return (
    <LayoutWithHeader title="Accueil">
      <View style={{ padding: 20 }}>
        <Text>Bienvenue sur la page d'accueil !</Text>
        <ScrollView contentContainerStyle={styles.container}>
          {cards.map((card) => (
            <NavigationCard
              key={card.screen}
              title={card.title}
              image={card.image}
              onPress={() => navigation.navigate(card.screen as any)}
            />
          ))}
        </ScrollView>
      </View>
    </LayoutWithHeader>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
