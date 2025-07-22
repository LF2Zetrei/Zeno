import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import PublishOrderButton from "../button/PublishOrderButton";
import { useOrderById } from "../../hooks/order/getOrderById";
import { useProductById } from "../../hooks/product/getProductById";
import { COLORS } from "../../styles/color";

type Props = {
  orderId: string;
  productId: string;
  onSuccess: () => void;
};

export default function SummaryStep({ orderId, productId, onSuccess }: Props) {
  const { order, loading: loadingOrder } = useOrderById(orderId);
  const { product, loading: loadingProduct } = useProductById(productId);

  const isLoading = loadingOrder || loadingProduct;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Étape 4 : Résumé</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primaryBlue} />
        ) : (
          <>
            {order && product ? (
              <>
                <Text style={styles.subtitle}>Commande :</Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>ID :</Text> {order.id}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>Client :</Text>{" "}
                  {order.buyer?.pseudo}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>Date :</Text>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </Text>

                <Text style={styles.subtitle}>Produit ajouté :</Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>Nom :</Text> {product.title}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>Prix :</Text> {product.price} €
                </Text>
              </>
            ) : (
              <Text style={styles.error}>
                Impossible de charger les données.
              </Text>
            )}
          </>
        )}

        <View style={styles.buttonBox}>
          <PublishOrderButton orderId={orderId} onSuccess={onSuccess} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: COLORS.background || "#fff",
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: "MuseoModernoBold",
    color: COLORS.primaryBlue,
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "NunitoBold",
    marginTop: 12,
    color: COLORS.primaryPink,
  },
  text: {
    fontSize: 16,
    fontFamily: "Nunito",
    color: COLORS.text || "#333",
    marginBottom: 4,
  },
  label: {
    fontFamily: "NunitoBold",
    color: COLORS.primaryBlue,
  },
  buttonBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  error: {
    fontSize: 16,
    fontFamily: "Nunito",
    color: "red",
    marginVertical: 12,
    textAlign: "center",
  },
});
