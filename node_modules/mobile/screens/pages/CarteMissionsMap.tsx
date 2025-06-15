import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, ActivityIndicator } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { useMissions } from "../../hooks/mission/useMissions";
import { useOrderById } from "../../hooks/order/getOrderById";

export default function CarteMissionsMap() {
  const { missions, loading: loadingMissions } = useMissions();
  const [selectedMission, setSelectedMission] = useState<string | null>(null); // idMission

  // Récupérer la commande liée à la mission sélectionnée
  const { order, loading: loadingOrder } = useOrderById(
    selectedMission
      ? missions.find((m) => m.idMission === selectedMission)?.orderId ?? ""
      : ""
  );
  console.log(order);
  console.log(missions);
  if (loadingMissions) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
        <Text>Chargement des missions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 46.5,
          longitude: 2,
          latitudeDelta: 7,
          longitudeDelta: 7,
        }}
      >
        {missions.map((mission) => {
          const orderId = mission.orderId;
          // On ne peut afficher le marker que si on a une commande liée (en cache ou chargée)
          // Ici, on n'a pas le détail complet de toutes les commandes, juste sur sélection
          // Donc on affiche quand même, mais sans détail complet.
          return (
            <Marker
              key={mission.idMission}
              coordinate={{
                latitude: order?.latitude || 46.5, // fallback, ou mieux : cacher le marker si pas les coordonnées
                longitude: order?.longitude || 2,
              }}
              title={`Mission #${mission.idMission}`}
              description={`Commande ${orderId}`}
              onPress={() => setSelectedMission(mission.idMission)}
            >
              <Callout>
                <Text>Mission ID : {mission.idMission}</Text>
                <Text>Commande ID : {orderId}</Text>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <Modal
        visible={!!selectedMission}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedMission(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {loadingOrder ? (
              <>
                <ActivityIndicator size="large" />
                <Text>Chargement des détails de la commande...</Text>
              </>
            ) : order ? (
              <>
                <Text style={styles.modalTitle}>
                  Mission ID : {selectedMission}
                </Text>
                <Text>Artisan : {order.artisanName}</Text>
                <Text>Adresse : {order.purchaseAddress}</Text>
                <Text>Ville : {order.city}</Text>
                <Text>Deadline : {order.deadline}</Text>
                <Text>Prix estimé : {order.priceEstimation} €</Text>

                <Text
                  style={styles.closeText}
                  onPress={() => setSelectedMission(null)}
                >
                  Fermer
                </Text>
              </>
            ) : (
              <>
                <Text>Détails de la commande non disponibles</Text>
                <Text
                  style={styles.closeText}
                  onPress={() => setSelectedMission(null)}
                >
                  Fermer
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
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
