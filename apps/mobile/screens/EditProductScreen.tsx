import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useProductById } from "../hooks/product/getProductById";
import EditProductForm from "../components/EditProductForm";

export default function EditProductScreen() {
  const productId = "f9faa335-a87d-4fd4-ab60-78e24913fab6";
  const { product, loading } = useProductById(productId);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Produit introuvable.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, margin: "50" }}>
      <EditProductForm
        productId={productId}
        initialData={product}
        onSubmit={(data) => console.log("Produit mis à jour :", data)}
      />
    </View>
  );
}
