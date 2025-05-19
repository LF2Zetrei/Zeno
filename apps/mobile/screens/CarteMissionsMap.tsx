// CarteMissionsMap.tsx (uniquement mobile)
import React, { useState } from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";

const missions = [
  {
    id: "1",
    produit: "Miel de lavande",
    lieu: "Nice",
    latitude: 43.7102,
    longitude: 7.262,
    villeArrivee: "Paris",
    date: "2025-05-20",
    prix: 12,
  },
  {
    id: "2",
    produit: "Vin local",
    lieu: "Bordeaux",
    latitude: 44.8378,
    longitude: -0.5792,
    villeArrivee: "Lyon",
    date: "2025-05-22",
    prix: 20,
  },
  {
    id: "3",
    produit: "Savon artisanal",
    lieu: "Marseille",
    latitude: 43.2965,
    longitude: 5.3698,
    villeArrivee: "Toulouse",
    date: "2025-05-25",
    prix: 8,
  },
];

export default function CarteMissionsMap() {
  const [selectedMission, setSelectedMission] = useState(null);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 44.5,
          longitude: 2.0,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
      >
        {missions.map((mission) => (
          <Marker
            key={mission.id}
            coordinate={{
              latitude: mission.latitude,
              longitude: mission.longitude,
            }}
            title={mission.produit}
            description={`Vers ${mission.villeArrivee}`}
            onPress={() => setSelectedMission(mission)}
          >
            <Callout>
              <Text>{mission.produit}</Text>
              <Text>
                {mission.lieu} ➜ {mission.villeArrivee}
              </Text>
              <Text>Prix : {mission.prix}€</Text>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <Modal
        visible={!!selectedMission}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedMission(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedMission?.produit}</Text>
            <Text>Départ : {selectedMission?.lieu}</Text>
            <Text>Arrivée : {selectedMission?.villeArrivee}</Text>
            <Text>Date : {selectedMission?.date}</Text>
            <Text>Prix : {selectedMission?.prix}€</Text>
            <Text
              style={styles.closeText}
              onPress={() => setSelectedMission(null)}
            >
              Fermer
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeText: {
    marginTop: 20,
    color: "blue",
    textAlign: "center",
  },
});
