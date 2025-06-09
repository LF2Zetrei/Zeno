import React from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useProducts } from "../hooks/product/useProducts";

export default function ProductList() {
  const { products, loading } = useProducts();

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <ScrollView>
      {products.map((product) => (
        <View key={product.id} style={{ padding: 12 }}>
          <Text>Nom : {product.name}</Text>
          <Text>Description : {product.description}</Text>
          <Text>Prix estimé : {product.estimatedPrice} €</Text>
        </View>
      ))}
    </ScrollView>
  );
}
