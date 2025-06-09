import React, { useState } from "react";
import { View, Text } from "react-native";
import CreateOrderForm from "../components/CreateOrderForm";

export default function CreateOrderScreen() {
  const [createdProduct, setCreatedProduct] = useState<any>(null);
  console.log(createdProduct);
  return (
    <View>
      <CreateOrderForm
        onOrderCreated={(product) => setCreatedProduct(product)}
      />
    </View>
  );
}
