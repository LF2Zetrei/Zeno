import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Text,
} from "react-native";
import CarteMissionsMap from "../../components/map/CarteMissionsMap";
import { useMissions } from "../../hooks/mission/useMissions";
import { useOrders } from "../../hooks/order/useOrders";
import { getMissionByOrderId } from "../../utils/getMissionByOrderId";
import { COLORS } from "../../styles/color";

export default function MissionsScreen() {
  const { missions, loading: loadingMissions } = useMissions();
  const { orders, loading: loadingOrders } = useOrders();

  const [trackingMode, setTrackingMode] = useState(false);
  const [myMissions, setMyMissions] = useState([]);

  useEffect(() => {
    const fetchMyMissions = async () => {
      if (!trackingMode || !orders || orders.length === 0) {
        setMyMissions([]);
        return;
      }

      const fetchedMissions = [];

      for (const order of orders) {
        const mission = await getMissionByOrderId(order.idOrder);
        if (mission && mission.travelerPseudo != null) {
          fetchedMissions.push(mission);
        }
      }

      setMyMissions(fetchedMissions);
    };

    fetchMyMissions();
  }, [trackingMode, orders]);

  if (loadingMissions || loadingOrders) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primaryBlue} />
        <Text style={{ marginTop: 10, color: COLORS.primaryBlue }}>
          Chargement des missions...
        </Text>
      </View>
    );
  }

  const displayedMissions = trackingMode ? myMissions : missions;

  return (
    <View style={styles.container}>
      <CarteMissionsMap
        missions={displayedMissions}
        trackingMode={trackingMode}
      />
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={() => setTrackingMode((prev) => !prev)}
        >
          <Text style={styles.buttonText}>
            {trackingMode ? "Voir les missions" : "Suivre mes commandes"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  buttonContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    backgroundColor: COLORS.primaryPink,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
});
