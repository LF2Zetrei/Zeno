// components/CarteMissionsMap.tsx

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Modal, ActivityIndicator } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { getOrderById } from "../utils/getOrderById";

export default function CarteMissionsMap({ missions, initialRegion }) {
  const [ordersMap, setOrdersMap] = useState(new Map());
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedMission, setSelectedMission] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!missions || missions.length === 0) return;

      setLoadingOrders(true);
      const newMap = new Map();

      for (const mission of missions) {
        const order = await getOrderById(mission.orderId);
        if (order) newMap.set(mission.idMission, order);
      }

      setOrdersMap(newMap);
      setLoadingOrders(false);
    };

    fetchOrders();
  }, [missions]);

  if (loadingOrders) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
        <Text>Chargement des commandes associées...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={
          initialRegion || {
            latitude: 46.5,
            longitude: 2,
            latitudeDelta: 7,
            longitudeDelta: 7,
          }
        }
      >
        {missions.map((mission) => {
          const order = ordersMap.get(mission.idMission);
          if (!order || !order.latitude || !order.longitude) return null;

          return (
            <Marker
              key={mission.idMission}
              coordinate={{
                latitude: order.latitude,
                longitude: order.longitude,
              }}
              onPress={() => setSelectedMission({ mission, order })}
            >
              <Callout>
                <Text>Mission ID: {mission.idMission}</Text>
                <Text>Commande ID: {order.idOrder}</Text>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <Modal
        key={selectedMission?.mission?.idMission ?? "none"}
        visible={!!selectedMission}
        onRequestClose={() => setSelectedMission(null)}
        animationType="slide"
        transparent
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedMission && selectedMission.order ? (
              <>
                <Text style={styles.modalTitle}>
                  Mission ID : {selectedMission.mission.idMission}
                </Text>
                <Text>Artisan : {selectedMission.order.artisanName}</Text>
                <Text>Adresse : {selectedMission.order.purchaseAddress}</Text>
                <Text>Ville : {selectedMission.order.city}</Text>
                <Text>Deadline : {selectedMission.order.deadline}</Text>
                <Text>
                  Prix estimé : {selectedMission.order.priceEstimation} €
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
