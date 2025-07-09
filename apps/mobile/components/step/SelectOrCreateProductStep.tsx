import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import CreateProductForm from "../form/CreateProductForm";
import { useProducts } from "../../hooks/product/useProducts";

type Props = {
  onProductSelected: (product: any) => void;
  selectedProductId: string | null;
};

export default function SelectOrCreateProductStep({
  onProductSelected,
  selectedProductId,
}: Props) {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Chargement des produits...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Étape 2 : Choisir ou créer un produit</Text>
      <CreateProductForm onProductCreated={onProductSelected} />

      <Text style={styles.subtitle}>Ou choisir un produit existant :</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.idProduct?.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.productItem,
              selectedProductId === item.idProduct && styles.selectedProduct,
            ]}
            onPress={() => onProductSelected(item)}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  subtitle: {
    fontWeight: "bold",
    marginTop: 20,
  },
  productItem: {
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  selectedProduct: {
    backgroundColor: "#ddd",
  },
});
