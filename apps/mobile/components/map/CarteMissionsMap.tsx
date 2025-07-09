import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Modal, ActivityIndicator } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { getOrderById } from "../../utils/getOrderById";
import { getTrackingPositionsByMissions } from "../../utils/getTrackingPositions";

export default function CarteMissionsMap({
  missions,
  initialRegion,
  trackingMode,
}) {
  const [ordersMap, setOrdersMap] = useState(new Map());
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedMission, setSelectedMission] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!missions || missions.length === 0) return;

      setLoadingOrders(true);
      const newMap = new Map();

      const fetchFunctions = missions.map(async (mission) => {
        try {
          const data = trackingMode
            ? (await getTrackingPositionsByMissions([mission]))[0]?.positions
            : await getOrderById(mission.orderId);
          if (data) {
            newMap.set(mission.idMission, data);
          }
        } catch (error) {
          console.error(`Erreur pour la mission ${mission.idMission} :`, error);
        }
      });

      await Promise.all(fetchFunctions);
      setOrdersMap(newMap);
      setLoadingOrders(false);
    };

    fetchData();
  }, [missions, trackingMode]);

  if (loadingOrders) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
        <Text>Chargement des données associées...</Text>
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
          const data = ordersMap.get(mission.idMission);
          if (!data || !data.latitude || !data.longitude) return null;

          return (
            <Marker
              key={mission.idMission}
              coordinate={{
                latitude: data.latitude,
                longitude: data.longitude,
              }}
              onPress={() => setSelectedMission({ mission, data })}
            >
              <Callout>
                <Text>Mission ID: {mission.idMission}</Text>
                {!trackingMode && <Text>Commande ID: {data.idOrder}</Text>}
                {trackingMode && <Text>Position trackée</Text>}
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
            {selectedMission && selectedMission.data && (
              <>
                <Text style={styles.modalTitle}>
                  Mission ID : {selectedMission.mission.idMission}
                </Text>

                {!trackingMode ? (
                  <>
                    <Text>Artisan : {selectedMission.data.artisanName}</Text>
                    <Text>
                      Adresse : {selectedMission.data.purchaseAddress}
                    </Text>
                    <Text>Ville : {selectedMission.data.city}</Text>
                    <Text>Deadline : {selectedMission.data.deadline}</Text>
                    <Text>
                      Prix estimé : {selectedMission.data.priceEstimation} €
                    </Text>
                  </>
                ) : (
                  <>
                    <Text>Position actuelle :</Text>
                    <Text>Latitude : {selectedMission.data.latitude}</Text>
                    <Text>Longitude : {selectedMission.data.longitude}</Text>
                  </>
                )}

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
