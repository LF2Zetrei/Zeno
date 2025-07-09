import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import EditOrderForm from "../../components/form/EditOrderForm";
import { useOrderById } from "../../hooks/order/getOrderById";

export default function EditOrderScreen() {
  const orderId = "39ddac4f-384f-4956-8ac6-79f9f1ef253d";
  const { order, loading } = useOrderById(orderId);
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Commande introuvable.</Text>
      </View>
    );
  }

  return (
    <EditOrderForm
      orderId={orderId}
      initialData={order}
      onSubmit={(data) => console.log("Commande mise à jour :", data)}
    />
  );
}
