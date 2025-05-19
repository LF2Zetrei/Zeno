import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

type Mission = {
  id: string;
  produit: string;
  villeDepart: string;
  villeArrivee: string;
  date: string;
  prix: number;
};

const missions: Mission[] = [
  {
    id: "1",
    produit: "Miel de lavande",
    villeDepart: "Nice",
    villeArrivee: "Paris",
    date: "2025-05-20",
    prix: 12,
  },
  {
    id: "2",
    produit: "Vin local",
    villeDepart: "Bordeaux",
    villeArrivee: "Lyon",
    date: "2025-05-22",
    prix: 20,
  },
  {
    id: "3",
    produit: "Savon artisanal",
    villeDepart: "Marseille",
    villeArrivee: "Toulouse",
    date: "2025-05-25",
    prix: 8,
  },
];

export default function ListeMissionsScreen() {
  const renderMission = ({ item }: { item: Mission }) => (
    <View style={styles.card}>
      <Text style={styles.produit}>{item.produit}</Text>
      <Text style={styles.villes}>
        {item.villeDepart} ➜ {item.villeArrivee}
      </Text>
      <Text>Date : {item.date}</Text>
      <Text>Prix : {item.prix}€</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Missions disponibles</Text>
      <FlatList
        data={missions}
        keyExtractor={(item) => item.id}
        renderItem={renderMission}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  produit: {
    fontSize: 18,
    fontWeight: "bold",
  },
  villes: {
    marginBottom: 6,
    color: "#555",
  },
});
