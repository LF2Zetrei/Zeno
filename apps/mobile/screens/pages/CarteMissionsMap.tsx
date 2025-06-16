import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Modal, ActivityIndicator } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { useMissions } from "../../hooks/mission/useMissions";
import { useAllOrders } from "../../hooks/order/useAllOrders";

export default function CarteMissionsMap() {
  const { missions, loading: loadingMissions } = useMissions();
  const { orders, loading: loadingOrders } = useAllOrders();
  const [selectedMission, setSelectedMission] = useState(null);

  const missionOrderMap = useMemo(() => {
    const map = new Map();
    missions.forEach((mission) => {
      const order = orders.find((o) => o.idOrder === mission.orderId);
      if (order) {
        map.set(mission, order);
      }
    });
    return map;
  }, [missions, orders]);

  if (loadingMissions || loadingOrders) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
        <Text>Chargement des missions et commandes...</Text>
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
        {[...missionOrderMap.entries()].map(([mission, order]) => (
          <Marker
            key={mission.idMission}
            coordinate={{
              latitude: order.latitude,
              longitude: order.longitude,
            }}
            onPress={() => setSelectedMission(mission)}
          >
            <Callout>
              <Text>Mission ID: {mission.idMission}</Text>
              <Text>Commande ID: {order.idOrder}</Text>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <Modal
        key={selectedMission?.idMission ?? "none"}
        visible={!!selectedMission}
        onRequestClose={() => setSelectedMission(null)}
        animationType="slide"
        transparent
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedMission ? (
              <>
                <Text style={styles.modalTitle}>
                  Mission ID : {selectedMission.idMission}
                </Text>
                <Text>
                  Artisan : {missionOrderMap.get(selectedMission).artisanName}
                </Text>
                <Text>
                  Adresse :{" "}
                  {missionOrderMap.get(selectedMission).purchaseAddress}
                </Text>
                <Text>Ville : {missionOrderMap.get(selectedMission).city}</Text>
                <Text>
                  Deadline : {missionOrderMap.get(selectedMission).deadline}
                </Text>
                <Text>
                  Prix estimé :{" "}
                  {missionOrderMap.get(selectedMission).priceEstimation} €
                </Text>

                <Text
                  style={styles.closeText}
                  onPress={() => setSelectedMission(null)}
                >
                  Fermer
                </Text>
              </>
            ) : null}
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
