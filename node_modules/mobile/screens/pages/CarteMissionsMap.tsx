import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import CarteMissionsMap from "../../components/CarteMissionsMap";
import { useMissions } from "../../hooks/mission/useMissions";

export default function MissionsScreen() {
  const { missions, loading } = useMissions();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CarteMissionsMap missions={missions} />
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
