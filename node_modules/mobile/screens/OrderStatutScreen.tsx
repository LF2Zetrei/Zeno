import React from "react";
import { Button, Text, View } from "react-native";
import { useOrderState } from "../hooks/order/useOrderState";

export default function OrderStatusChanger() {
  const { updateOrderStatus, loading, error, success } = useOrderState();

  const handleChangeStatus = () => {
    updateOrderStatus("eda372da-813d-4a3a-bfab-55f6fd6bfc66", "DELIVERED");
  };

  return (
    <View>
      <Button
        title="Changer le statut"
        onPress={handleChangeStatus}
        disabled={loading}
      />
      {loading && <Text>Chargement...</Text>}
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      {success && (
        <Text style={{ color: "green" }}>Statut modifié avec succès !</Text>
      )}
    </View>
  );
}
