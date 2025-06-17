import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import CreateProductForm from "../../components/CreateProductForm";
import CreateOrderForm from "../../components/CreateOrderForm";
import AddProductToOrderButton from "../../components/AddProductToOrderButton";
import { useProducts } from "../../hooks/product/useProducts";
import PublishOrderButton from "../../components/PublishOrderButton";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";

export default function OrderWizard() {
  const [step, setStep] = useState(1);
  const [productId, setProductId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { products, loading: productsLoading } = useProducts();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  if (productsLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
        <Text>Chargement des produits...</Text>
      </View>
    );
  }

  const handleProductCreated = (product: any) => {
    console.log("Produit reçu après création :", product);
    setProductId(product.idProduct);
    setStep(3);
  };

  const handleOrderCreated = (order: any) => {
    console.log("Commande reçue après création :", order);
    setOrderId(order.idOrder);
    setStep(2);
  };

  const handleSuccess = () => {
    // ton code en cas de succès...
    navigation.navigate("Accueil"); // redirige vers l'écran HomeScreen
  };

  if (step === 1) {
    return (
      <View style={styles.container}>
        <Text>Étape 1 : Créer une commande</Text>
        <CreateOrderForm onOrderCreated={handleOrderCreated} />
      </View>
    );
  }

  if (step === 2) {
    return (
      <View style={styles.container}>
        <Text>Étape 2 : Choisir ou créer un produit</Text>

        <CreateProductForm onProductCreated={handleProductCreated} />

        <Text style={styles.subtitle}>Ou choisir un produit existant :</Text>

        <FlatList
          data={products}
          keyExtractor={(item) => item.idProduct?.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.productItem,
                productId === item.idProduct && styles.selectedProduct,
              ]}
              onPress={() => handleProductCreated(item)}
            >
              <Text style={{ fontSize: 14 }}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  if (step === 3) {
    return (
      <View style={styles.container}>
        <Text>Étape 3 : Ajouter le produit à la commande</Text>
        {orderId && productId && (
          <AddProductToOrderButton
            orderIda={orderId}
            productIda={productId}
            onSuccess={() => setStep(4)}
          />
        )}
      </View>
    );
  }

  if (step === 4) {
    return (
      <View style={styles.container}>
        <Text>Étape 4 : Résumé</Text>
        <Text>
          Commande #{orderId} a bien été mise à jour avec le produit #
          {productId}.
        </Text>
        <PublishOrderButton orderId={orderId} onSuccess={handleSuccess} />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
