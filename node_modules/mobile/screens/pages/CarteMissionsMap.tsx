import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, ActivityIndicator } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { useAuth } from "../context/AuthContext"; // je suppose que c'est ton hook d'authentification

interface Mission {
  idMission: string;
  orderId: string;
  // autres champs non utilisés ici
}

interface Order {
  idOrder: string;
  artisanName: string;
  latitude: number;
  longitude: number;
  city: string;
  purchaseAddress: string;
  deadline: string;
  priceEstimation: number;
  orderProducts: Array<{ productName: string }>; // à adapter si tu as un vrai type produit
}

export default function CarteMissionsMap() {
  const { token } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [orders, setOrders] = useState<Record<string, Order>>({}); // clé = orderId
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMissionsAndOrders() {
      try {
        // 1) fetch missions
        const resMissions = await fetch("http://localhost:8080/api/mission", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const missionsData: Mission[] = await resMissions.json();
        setMissions(missionsData);

        // 2) fetch toutes les commandes liées en parallèle
        const uniqueOrderIds = Array.from(
          new Set(missionsData.map((m) => m.orderId))
        );
        const ordersFetched: Record<string, Order> = {};

        await Promise.all(
          uniqueOrderIds.map(async (orderId) => {
            const resOrder = await fetch(
              `http://localhost:8080/api/order/${orderId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (resOrder.ok) {
              const orderData: Order = await resOrder.json();
              ordersFetched[orderId] = orderData;
            }
          })
        );

        setOrders(ordersFetched);
      } catch (error) {
        console.error("Erreur fetch missions/orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMissionsAndOrders();
  }, [token]);

  if (loading) {
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
          const order = orders[mission.orderId];
          if (!order) return null; // pas encore chargé ou erreur

          return (
            <Marker
              key={mission.idMission}
              coordinate={{
                latitude: order.latitude,
                longitude: order.longitude,
              }}
              title={order.artisanName || "Mission"}
              description={`${order.city} - Deadline: ${order.deadline}`}
              onPress={() => setSelectedMission(mission)}
            >
              <Callout>
                <Text>Artisan : {order.artisanName}</Text>
                <Text>Adresse : {order.purchaseAddress}</Text>
                <Text>Ville : {order.city}</Text>
                <Text>Deadline : {order.deadline}</Text>
                <Text>Prix estimé : {order.priceEstimation} €</Text>
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
            {selectedMission && (
              <>
                <Text style={styles.modalTitle}>
                  Mission ID : {selectedMission.idMission}
                </Text>
                {orders[selectedMission.orderId] ? (
                  <>
                    <Text>
                      Artisan : {orders[selectedMission.orderId].artisanName}
                    </Text>
                    <Text>
                      Adresse :{" "}
                      {orders[selectedMission.orderId].purchaseAddress}
                    </Text>
                    <Text>Ville : {orders[selectedMission.orderId].city}</Text>
                    <Text>
                      Deadline : {orders[selectedMission.orderId].deadline}
                    </Text>
                    <Text>
                      Prix estimé :{" "}
                      {orders[selectedMission.orderId].priceEstimation} €
                    </Text>
                  </>
                ) : (
                  <Text>Détails de la commande non disponibles</Text>
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
