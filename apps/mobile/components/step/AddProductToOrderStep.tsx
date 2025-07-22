import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import AddProductToOrderButton from "../button/AddProductToOrderButton";
import { COLORS } from "../../styles/color"; // réutilise ta palette si possible

type Props = {
  orderId: string;
  productId: string;
  onSuccess: () => void;
};

export default function AddProductToOrderStep({
  orderId,
  productId,
  onSuccess,
}: Props) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>
          Étape 3 : Ajouter le produit à la commande
        </Text>

        <AddProductToOrderButton
          orderIda={orderId}
          productIda={productId}
          onSuccess={onSuccess}
        />
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
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontFamily: "MuseoModernoBold",
    color: COLORS.primaryBlue,
    marginBottom: 20,
    textAlign: "center",
  },
});
