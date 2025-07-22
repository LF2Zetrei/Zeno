import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import CreateProductForm from "../form/CreateProductForm";
import { useProducts } from "../../hooks/product/useProducts";
import { COLORS } from "../../styles/color";

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
        <ActivityIndicator size="large" color={COLORS.primaryBlue} />
        <Text style={styles.loadingText}>Chargement des produits...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Étape 2 : Choisir ou créer un produit</Text>

        <CreateProductForm onProductCreated={onProductSelected} />

        <Text style={styles.sectionTitle}>
          Ou choisir un produit existant :
        </Text>

        {products.map((item) => (
          <TouchableOpacity
            key={item.idProduct}
            style={[
              styles.productItem,
              selectedProductId === item.idProduct && styles.selectedProduct,
            ]}
            onPress={() => onProductSelected(item)}
          >
            <Text style={styles.productText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
  scrollContainer: {
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "Nunito",
    fontSize: 14,
  },
  title: {
    fontSize: 20,
    fontFamily: "MuseoModernoBold",
    color: COLORS.primaryBlue,
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "NunitoBold",
    color: COLORS.primaryPink,
    marginTop: 30,
    marginBottom: 10,
  },
  listContainer: {
    gap: 10,
  },
  productItem: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primaryPink,
  },
  selectedProduct: {
    backgroundColor: COLORS.primaryPink,
  },
  productText: {
    fontFamily: "Nunito",
    color: COLORS.primaryBlue,
  },
});
