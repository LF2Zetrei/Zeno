import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Button } from "react-native";
import CarteMissionsMap from "../../components/CarteMissionsMap";
import { useMissions } from "../../hooks/mission/useMissions";
import { useOrders } from "../../hooks/order/useOrders";
import { getMissionByOrderId } from "../../utils/getMissionByOrderId";

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
        console.log("\x1b[31m%s\x1b[0m", mission);
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
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const displayedMissions = trackingMode ? myMissions : missions;

  return (
    <View style={{ flex: 1 }}>
      <Button
        title={
          trackingMode
            ? "Revenir à la position des missions"
            : "Voir le tracking de mes positions"
        }
        onPress={() => setTrackingMode((prev) => !prev)}
      />
      <CarteMissionsMap
        missions={displayedMissions}
        trackingMode={trackingMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
