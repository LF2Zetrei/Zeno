import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useOrders } from "../../hooks/order/useOrders";
import EditOrderForm from "../../components/form/EditOrderForm";
import PublishOrderButton from "../../components/button/PublishOrderButton";
import { getMissionByOrderId } from "../../utils/getMissionByOrderId";
import DeleteOrderButton from "../../components/button/DeleteOrderButton";
import { useNavigation } from "@react-navigation/native";
import ReceivedMissionButton from "../../components/button/ReceivedMissionButton";
import { getProductsByOrder } from "../../utils/getProductsByOrder";
import { COLORS } from "../../styles/color"; // <-- import des couleurs

export default function ListeOrderScreen() {
  const { orders: ordersFromHook, loading: loadingOrders } = useOrders();
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [missions, setMissions] = useState<Record<string, any>>({});
  const [productsByOrder, setProductsByOrder] = useState<Record<string, any[]>>(
    {}
  );
  const [loadingMissions, setLoadingMissions] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Charger commandes
  useEffect(() => {
    setOrders(ordersFromHook);
  }, [ordersFromHook]);

  // Charger missions
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
            `Erreur récupération mission pour ${order.idOrder}`,
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

  // Charger produits
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      const productsMap: Record<string, any[]> = {};

      for (const order of ordersFromHook) {
        try {
          const products = await getProductsByOrder(order.idOrder);
          if (products) {
            productsMap[order.idOrder] = products;
          }
        } catch (error) {
          console.error(
            `Erreur récupération produits pour ${order.idOrder}`,
            error
          );
        }
      }

      setProductsByOrder(productsMap);
      setLoadingProducts(false);
    };

    if (ordersFromHook.length > 0) {
      fetchProducts();
    }
  }, [ordersFromHook]);

  const handleUpdateOrder = (idOrder: string, updatedData: any) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.idOrder === idOrder ? { ...order, ...updatedData } : order
      )
    );
    setEditingOrderId(null);
  };

  if (loadingOrders) {
    return <ActivityIndicator size="large" color={COLORS.primaryBlue} />;
  }

  // Si les commandes sont vides après chargement
  if (!loadingOrders && orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize: 16, color: COLORS.primaryBlue }}>
          Aucune commande trouvée.
        </Text>
      </View>
    );
  }

  // Si les commandes sont là, mais missions ou produits en cours de chargement
  if (loadingMissions || loadingProducts) {
    return <ActivityIndicator size="large" color={COLORS.primaryBlue} />;
  }

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.idOrder}
        renderItem={({ item }) => {
          const mission = missions[item.idOrder];
          const products = productsByOrder[item.idOrder] || [];

          // Titre : nom du produit(s)
          const title =
            products.length === 0
              ? "Commande sans produit"
              : products.length === 1
              ? products[0].name
              : `${products[0].name} & ${products[1].name}`;

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
              <TouchableOpacity
                onPress={() =>
                  setExpandedOrderId(
                    expandedOrderId === item.idOrder ? null : item.idOrder
                  )
                }
              >
                <Text style={styles.title}>{title}</Text>
              </TouchableOpacity>

              {expandedOrderId === item.idOrder && (
                <>
                  {/* Section Commande */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Commande</Text>
                    <Text>
                      Acheteur : {item.buyer.firstName} {item.buyer.lastName} (
                      {item.buyer.pseudo})
                    </Text>
                    <Text>Adresse d'achat : {item.purchaseAddress}</Text>
                    <Text>Ville : {item.city}</Text>
                    <Text>Pays : {item.purchaseCountry}</Text>
                    <Text>
                      Date limite :{" "}
                      {item.deadline
                        ? new Date(item.deadline).toLocaleDateString()
                        : "-"}
                    </Text>
                    <Text>Prix estimé : {item.priceEstimation} €</Text>
                    <Text>Artisan : {item.artisanName}</Text>
                    <Text>Statut : {item.status}</Text>
                    <Text>
                      Créée le : {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>

                  {/* Section Produits */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Produits</Text>
                    {products.length === 0 ? (
                      <Text>Aucun produit pour cette commande.</Text>
                    ) : (
                      products.map((product, index) => (
                        <View key={index} style={styles.productCard}>
                          <Text>Nom : {product.name}</Text>
                          <Text>Ville : {product.city}</Text>
                          <Text>Description : {product.description}</Text>
                          <Text>Quantité : {product.quantity}</Text>
                          <Text>Poids : {product.weight} kg</Text>
                          <Text>Prix estimé : {product.estimatedPrice} €</Text>
                        </View>
                      ))
                    )}
                  </View>

                  {/* Boutons empilés */}
                  <View style={styles.buttonContainer}>
                    {mission &&
                      mission.idMission &&
                      mission?.isPublic === true && (
                        <ReceivedMissionButton
                          missionId={mission.idMission}
                          onSuccess={() => {
                            console.log("Mission reçue !");
                          }}
                          buttonStyle={styles.button}
                        />
                      )}
                    {mission?.isPublic === false && (
                      <>
                        <PublishOrderButton
                          orderId={item.idOrder}
                          onSuccess={() => {
                            console.log("Mission publiée avec succès");
                          }}
                          buttonStyle={styles.button}
                        />
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() =>
                            navigation.navigate("CreateMission", {
                              orderId: item.idOrder,
                            })
                          }
                        >
                          <Text style={styles.buttonText}>
                            Ajouter un produit
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => setEditingOrderId(item.idOrder)}
                        >
                          <Text style={styles.buttonText}>
                            Modifier la commande
                          </Text>
                        </TouchableOpacity>
                        <DeleteOrderButton
                          orderId={item.idOrder}
                          onDeleted={() => {
                            setOrders((prev) =>
                              prev.filter(
                                (order) => order.idOrder !== item.idOrder
                              )
                            );
                          }}
                          buttonStyle={styles.button}
                        />
                      </>
                    )}
                  </View>
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
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1.5,
    borderColor: COLORS.primaryPink,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "flex-start",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: COLORS.primaryBlue,
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.primaryPink,
  },
  productCard: {
    backgroundColor: "#e9e9f0",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "column",
    gap: 10, // gap est dispo depuis RN 0.71+, sinon utiliser marginBottom sur boutons
  },
  button: {
    backgroundColor: COLORS.primaryPink,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: COLORS.background,
    fontWeight: "600",
    fontSize: 16,
  },
  centered: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
