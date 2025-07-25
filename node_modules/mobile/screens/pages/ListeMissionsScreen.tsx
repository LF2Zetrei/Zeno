import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useMissions } from "../../hooks/mission/useMissions";
import { useMyMissions } from "../../hooks/mission/useMyMissions";
import { useUserByJwt } from "../../hooks/user/getUserByJwt";
import AcceptMissionButton from "../../components/button/AcceptMissionButton";
import UnassignMissionButton from "../../components/button/UnassignMissionButton";
import { useMissionState } from "../../hooks/mission/useMissionState";
import { useNearbyMissions } from "../../hooks/mission/getMissionsNearby";
import DeliveredMissionButton from "../../components/button/DeliveredMissionButton";
import { useNavigation } from "@react-navigation/native";
import { getOrderById } from "../../utils/getOrderById";
import { getProductsByOrder } from "../../utils/getProductsByOrder";

// Import des couleurs
import { COLORS } from "../../styles/color";

export default function MissionsScreen() {
  const { missions: missionsFromHook, loading: loadingMissions } =
    useMissions();
  const { missions: myMissions, loading: loadingMyMissions } = useMyMissions();
  const { user, loading: loadingUser } = useUserByJwt();
  const { updateMissionStatus } = useMissionState();
  const [radiusKm, setRadiusKm] = useState(10);
  const { missions: nearbyMissions, loading: loadingNearby } =
    useNearbyMissions(radiusKm);
  const navigation = useNavigation();

  const [missions, setMissions] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [ordersById, setOrdersById] = useState({});
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Pour gérer quelle carte est ouverte
  const [expandedMissionId, setExpandedMissionId] = useState(null);

  useEffect(() => {
    setMissions(missionsFromHook);
  }, [missionsFromHook]);

  useEffect(() => {
    const fetchOrdersWithProducts = async () => {
      setLoadingOrders(true);
      const updatedOrders = {};

      for (const mission of missions) {
        const orderId = mission.orderId;
        const order = await getOrderById(orderId);
        if (order) {
          try {
            const products = await getProductsByOrder(orderId);
            updatedOrders[orderId] = { ...order, products };
          } catch (e) {
            console.warn("Erreur lors du chargement des produits :", e);
            updatedOrders[orderId] = { ...order, products: [] };
          }
        }
      }

      setOrdersById(updatedOrders);
      setLoadingOrders(false);
    };

    if (missions.length > 0) {
      fetchOrdersWithProducts();
    }
  }, [missions]);

  const handleValidatingMission = async (missionId) => {
    await updateMissionStatus(missionId, "COMPLETED");
  };

  const handleAcceptMission = (missionId) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.idMission === missionId
          ? {
              ...m,
              travelerId: user.idUser,
              travelerPseudo: user.pseudo,
              status: "ACCEPTED",
            }
          : m
      )
    );
  };

  const toggleExpand = (missionId) => {
    setExpandedMissionId(expandedMissionId === missionId ? null : missionId);
  };

  const renderMissionCard = (item) => {
    const order = ordersById[item.orderId];
    const isExpanded = expandedMissionId === item.idMission;

    // Pour la carte, on prend le premier produit si dispo
    const firstProduct = order?.products?.[0];

    return (
      <TouchableOpacity
        key={item.idMission}
        style={styles.missionCard}
        activeOpacity={0.8}
        onPress={() => toggleExpand(item.idMission)}
      >
        {!isExpanded ? (
          // Version fermée : titre, prix, ville
          <>
            <Text style={styles.missionTitle}>
              {firstProduct ? firstProduct.name : "Produit inconnu"}
            </Text>
            <Text style={styles.missionPrice}>
              Prix estimé :{" "}
              {firstProduct ? firstProduct.estimatedPrice + " €" : "N/A"}
            </Text>
            <Text style={styles.missionCity}>
              Ville : {order?.city || "Inconnue"}
            </Text>
          </>
        ) : (
          // Version ouverte avec toutes les infos
          <>
            {/* Section Mission */}
            <Text style={styles.sectionTitle}>Mission</Text>
            <Text style={styles.missionText}>ID : {item.idMission}</Text>
            <Text style={styles.missionText}>Statut : {item.status}</Text>
            <Text style={styles.missionText}>
              Créée le : {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            {item.travelerPseudo && (
              <Text style={styles.missionText}>
                Voyageur : {item.travelerPseudo}
              </Text>
            )}

            {/* Section Commande */}
            {order && (
              <>
                <Text style={styles.sectionTitle}>Commande</Text>
                <Text style={styles.missionText}>ID : {order.id}</Text>
                <Text style={styles.missionText}>
                  Acheteur : {order.buyer?.pseudo}
                </Text>
                <Text style={styles.missionText}>
                  Deadline : {new Date(order.deadline).toLocaleDateString()}
                </Text>
                <Text style={styles.missionText}>
                  Estimation : {order.priceEstimation} €
                </Text>
                <Text style={styles.missionText}>
                  Adresse achat : {order.purchaseAddress}
                </Text>
                <Text style={styles.missionText}>
                  Pays d'achat : {order.purchaseCountry}
                </Text>
                <Text style={styles.missionText}>Ville : {order.city}</Text>
                <Text style={styles.missionText}>
                  Artisan : {order.artisanName}
                </Text>
              </>
            )}

            {/* Section Produit */}
            {order?.products?.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Produit(s)</Text>
                {order.products.map((product, index) => (
                  <View
                    key={index}
                    style={{ marginLeft: 10, marginBottom: 10 }}
                  >
                    <Text style={styles.missionText}>Nom : {product.name}</Text>
                    <Text style={styles.missionText}>
                      Description : {product.description}
                    </Text>
                    <Text style={styles.missionText}>
                      Poids : {product.weight} kg
                    </Text>
                    <Text style={styles.missionText}>
                      Quantité : {product.quantity}
                    </Text>
                    <Text style={styles.missionText}>
                      Prix estimé : {product.estimatedPrice} €
                    </Text>
                  </View>
                ))}
              </>
            )}

            {/* Boutons côte à côte */}
            <View style={styles.buttonRow}>
              {item.status !== "COMPLETED" &&
                String(item.travelerId) === String(user.idUser) && (
                  <DeliveredMissionButton
                    missionId={item.idMission}
                    onSuccess={() => handleValidatingMission(item.idMission)}
                    style={styles.button}
                  />
                )}

              {!item.travelerId &&
                selectedTab === "all" &&
                item.travelerPseudo === null && (
                  <View style={{ marginTop: 10 }}>
                    <AcceptMissionButton
                      missionId={item.idMission}
                      onSuccess={() => handleAcceptMission(item.idMission)}
                    />
                    <TouchableOpacity
                      style={styles.msgButton}
                      onPress={() => {
                        if (order?.buyer?.idUser) {
                          navigation.navigate("Messagerie", {
                            contactId: order.buyer.idUser,
                            contactName: order.buyer.pseudo,
                          });
                        } else {
                          alert("Impossible de récupérer l'acheteur.");
                        }
                      }}
                    >
                      <Text style={styles.msgButtonText}>
                        Aller à la messagerie
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
            </View>
          </>
        )}
      </TouchableOpacity>
    );
  };

  if (loadingMissions || loadingMyMissions || loadingUser || loadingOrders) {
    return <ActivityIndicator size="large" color={COLORS.primaryBlue} />;
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: COLORS.background }}>
      {/* Onglets */}
      <View style={styles.tabContainer}>
        {["all", "my", "nearby"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.tabButtonSelected,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextSelected,
              ]}
            >
              {tab === "all"
                ? "Toutes les missions"
                : tab === "my"
                ? "Mes missions"
                : "Missions proches"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenu */}
      <ScrollView style={{ marginTop: 20 }}>
        {selectedTab === "my" ? (
          myMissions.length === 0 ? (
            <Text>Aucune mission</Text>
          ) : (
            myMissions.map(renderMissionCard)
          )
        ) : selectedTab === "nearby" ? (
          <>
            <Text style={{ marginBottom: 5 }}>
              Rayon de recherche : {radiusKm} km
            </Text>
            <Slider
              style={{ width: "100%" }}
              minimumValue={1}
              maximumValue={200}
              step={1}
              value={radiusKm}
              onValueChange={setRadiusKm}
              minimumTrackTintColor={COLORS.primaryPink}
              maximumTrackTintColor="#ddd"
              thumbTintColor={COLORS.primaryPink}
            />
            {loadingNearby ? (
              <ActivityIndicator color={COLORS.primaryPink} />
            ) : nearbyMissions.length === 0 ? (
              <Text>Aucune mission à proximité</Text>
            ) : (
              nearbyMissions.map(renderMissionCard)
            )}
          </>
        ) : (
          missions.filter((m) => m.travelerId === null).map(renderMissionCard)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#eee",
    borderRadius: 10,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ccc",
    alignItems: "center",
  },
  tabButtonSelected: {
    backgroundColor: COLORS.primaryPink,
  },
  tabText: {
    fontWeight: "bold",
    color: "#444",
  },
  tabTextSelected: {
    color: "white",
  },
  missionCard: {
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
    alignItems: "flex-start", // contrairement à center
  },
  missionTitle: {
    fontSize: 16,
    color: COLORS.primaryBlue,
    marginBottom: 6,
    fontFamily: "MuseoModernoBold",
  },
  missionPrice: {
    fontSize: 13,
    color: "#555",
    marginBottom: 3,
    fontFamily: "Nunito",
  },
  missionCity: {
    fontSize: 13,
    color: "#555",
    fontFamily: "Nunito",
  },
  sectionTitle: {
    fontSize: 14,
    color: COLORS.primaryPink,
    fontFamily: "NunitoBold",
    marginTop: 10,
    marginBottom: 5,
  },
  missionText: {
    fontSize: 13,
    color: "#444",
    fontFamily: "Nunito",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  msgButton: {
    backgroundColor: COLORS.primaryPink,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  msgButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
