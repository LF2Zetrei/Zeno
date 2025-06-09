import React from "react";
import { View } from "react-native";
import CreateProductForm from "../components/CreateProductForm";

export default function CreateProductScreen() {
  const handleProductCreated = (product) => {
    console.log(product);
  };
  return (
    <View>
      <CreateProductForm onProductCreated={handleProductCreated} />
    </View>
  );
}
