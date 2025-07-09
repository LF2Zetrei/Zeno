import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Button,
  StyleSheet,
} from "react-native";
import { useOrders } from "../../hooks/order/useOrders";
import EditOrderForm from "../../components/form/EditOrderForm";
import PublishOrderButton from "../../components/button/PublishOrderButton";
import { getMissionByOrderId } from "../../utils/getMissionByOrderId";
import DeleteOrderButton from "../../components/button/DeleteOrderButton";
import { useNavigation } from "@react-navigation/native";
import ReceivedMissionButton from "../../components/button/ReceivedMissionButton";

export default function ListeOrderScreen() {
  const { orders: ordersFromHook, loading: loadingOrders } = useOrders();
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [missions, setMissions] = useState<Record<string, any>>({});
  const [loadingMissions, setLoadingMissions] = useState(true);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  // Charger les commandes
  useEffect(() => {
    setOrders(ordersFromHook);
  }, [ordersFromHook]);

  useEffect(() => {
    const fetchMissions = async () => {
      setLoadingMissions(true);
      const missionMap: Record<string, any> = {};

      for (const order of ordersFromHook) {
        try {
          const mission = await getMissionByOrderId(order.idOrder);
          if (mission) {
            missionMap[order.idOrder] = mission;
          }
        } catch (error) {
          console.error(
            `Erreur lors de la récupération de la mission pour ${order.idOrder}`,
            error
          );
        }
      }

      setMissions(missionMap);
      setLoadingMissions(false);
    };

    if (ordersFromHook.length > 0) {
      fetchMissions();
    }
  }, [ordersFromHook]);

  // Mettre à jour une commande après modification
  const handleUpdateOrder = (idOrder: string, updatedData: any) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.idOrder === idOrder ? { ...order, ...updatedData } : order
      )
    );
    setEditingOrderId(null);
  };

  if (loadingOrders || loadingMissions) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Aucune commande trouvée.</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.idOrder}
        renderItem={({ item }) => {
          const mission = missions[item.idOrder];
          console.log(mission);
          if (editingOrderId === item.idOrder) {
            return (
              <EditOrderForm
                orderId={item.idOrder}
                initialData={{
                  purchaseAddress: item.purchaseAddress,
                  purchaseCountry: item.purchaseCountry,
                  deadline: item.deadline?.slice(0, 10),
                  artisanName: item.artisanName,
                }}
                onSubmit={(updatedData) =>
                  handleUpdateOrder(item.idOrder, updatedData)
                }
              />
            );
          }

          return (
            <View style={styles.card}>
              <Text style={styles.title}>Commande : {item.idOrder}</Text>
              <Text>
                Acheteur : {item.buyer.firstName} {item.buyer.lastName} (
                {item.buyer.pseudo})
              </Text>
              <Text>Adresse d'achat : {item.purchaseAddress}</Text>
              <Text>Ville : {item.city}</Text>
              <Text>Pays : {item.purchaseCountry}</Text>
              <Text>
                Date limite :{" "}
                {item.deadline && new Date(item.deadline).toLocaleDateString()}
              </Text>
              <Text>Prix estimé : {item.priceEstimation} €</Text>
              <Text>Artisan : {item.artisanName}</Text>
              <Text>Statut : {item.status}</Text>
              <Text>
                Créée le : {new Date(item.createdAt).toLocaleDateString()}
              </Text>
              {mission && mission.idMission && (
                <ReceivedMissionButton
                  missionId={mission.idMission}
                  onSuccess={() => {
                    console.log("Mission reçue !");
                  }}
                />
              )}
              <Text>Mission isPublic : {String(mission?.isPublic)}</Text>
              {mission?.isPublic === false && (
                <>
                  <Button
                    title="Ajouter un produit"
                    onPress={() =>
                      navigation.navigate("CreateMission", {
                        orderId: item.idOrder, // 👈 On passe l'id
                      })
                    }
                  />
                  <Button
                    title="Modifier la commande"
                    onPress={() => setEditingOrderId(item.idOrder)}
                  />
                  <PublishOrderButton
                    orderId={item.idOrder}
                    onSuccess={() => {
                      console.log("Mission publiée avec succès");
                    }}
                  />
                  <DeleteOrderButton
                    orderId={item.idOrder}
                    onDeleted={() => {
                      // Supprimer la commande de l'état local
                      setOrders((prev) =>
                        prev.filter((order) => order.idOrder !== item.idOrder)
                      );
                    }}
                  />
                </>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  centered: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    marginTop: 10,
  },
  warning: {
    color: "#d11a2a",
    marginBottom: 5,
  },
});
