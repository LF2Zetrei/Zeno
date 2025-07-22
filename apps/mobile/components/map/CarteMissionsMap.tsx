import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Modal, ActivityIndicator } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { getOrderById } from "../../utils/getOrderById";
import { getTrackingPositionsByMissions } from "../../utils/getTrackingPositions";
import { getProductsByOrder } from "../../utils/getProductsByOrder";
import { COLORS } from "../../styles/color";

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
          let data;
          if (trackingMode) {
            data = (await getTrackingPositionsByMissions([mission]))[0]
              ?.positions;
          } else {
            data = await getOrderById(mission.orderId);
            // récupérer les produits liés à la commande
            const products = await getProductsByOrder(mission.orderId);
            if (data) {
              data.products = products || [];
            }
          }
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
              pinColor={COLORS.primaryPink}
              onPress={() => setSelectedMission({ mission, data })}
            >
              <Callout>
                <Text style={{ fontWeight: "bold", color: "#2f167f" }}>
                  Mission ID: {mission.idMission}
                </Text>
                {!trackingMode && (
                  <Text style={{ color: "#050212" }}>
                    Commande ID: {data.idOrder}
                  </Text>
                )}
                {trackingMode && (
                  <Text style={{ color: "#050212" }}>Position trackée</Text>
                )}
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
          <View style={styles.missionCard}>
            {selectedMission && selectedMission.data && (
              <>
                {/* TITRE */}
                <Text style={styles.missionTitle}>
                  Mission ID : {selectedMission.mission.idMission}
                </Text>

                {!trackingMode ? (
                  <>
                    {/* SECTION COMMANDE */}
                    <Text style={styles.sectionTitle}>Commande</Text>
                    <Text style={styles.missionText}>
                      Artisan : {selectedMission.data.artisanName}
                    </Text>
                    <Text style={styles.missionText}>
                      Adresse : {selectedMission.data.purchaseAddress}
                    </Text>
                    <Text style={styles.missionText}>
                      Ville : {selectedMission.data.city}
                    </Text>
                    <Text style={styles.missionText}>
                      Deadline :{" "}
                      {new Date(
                        selectedMission.data.deadline
                      ).toLocaleDateString()}
                    </Text>
                    <Text style={styles.missionText}>
                      Prix estimé : {selectedMission.data.priceEstimation} €
                    </Text>

                    {/* SECTION PRODUITS */}
                    <Text style={styles.sectionTitle}>Produits</Text>
                    {selectedMission.data.products.length === 0 ? (
                      <Text style={styles.missionText}>
                        Aucun produit associé.
                      </Text>
                    ) : (
                      selectedMission.data.products.map((product, index) => (
                        <View
                          key={index}
                          style={{ marginLeft: 10, marginBottom: 10 }}
                        >
                          <Text style={styles.missionText}>
                            Nom : {product.name}
                          </Text>
                          <Text style={styles.missionText}>
                            Prix estimé : {product.estimatedPrice} €
                          </Text>
                          <Text style={styles.missionText}>
                            Poids : {product.weight} kg
                          </Text>
                          <Text style={styles.missionText}>
                            Quantité : {product.quantity}
                          </Text>
                        </View>
                      ))
                    )}
                  </>
                ) : (
                  <>
                    {/* POSITION TRACKÉE */}
                    <Text style={styles.sectionTitle}>Position actuelle</Text>
                    <Text style={styles.missionText}>
                      Latitude : {selectedMission.data.latitude}
                    </Text>
                    <Text style={styles.missionText}>
                      Longitude : {selectedMission.data.longitude}
                    </Text>
                  </>
                )}

                {/* FERMER */}
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
  container: {
    flex: 1,
    backgroundColor: "#fff", // background
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // même que background
  },
  map: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // overlay noir transparent
  },
  missionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    width: "85%",
    borderWidth: 1.5,
    borderColor: COLORS.primaryPink,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  missionTitle: {
    fontSize: 16,
    color: COLORS.primaryBlue,
    marginBottom: 6,
    fontFamily: "MuseoModernoBold",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 14,
    color: COLORS.primaryPink,
    fontFamily: "NunitoBold",
    marginTop: 12,
    marginBottom: 5,
  },
  missionText: {
    fontSize: 13,
    color: "#444",
    fontFamily: "Nunito",
  },
  closeText: {
    marginTop: 20,
    color: COLORS.primaryYellow,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
});
