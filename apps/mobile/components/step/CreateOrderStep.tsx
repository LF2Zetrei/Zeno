import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CreateOrderForm from "../form/CreateOrderForm";
import { COLORS } from "../../styles/color";

type Props = {
  onOrderCreated: (order: any) => void;
};

export default function CreateOrderStep({ onOrderCreated }: Props) {
  return (
    <View>
      <Text style={styles.title}>Étape 1 : Créer une commande</Text>
      <CreateOrderForm onOrderCreated={onOrderCreated} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontFamily: "MuseoModernoBold",
    color: COLORS.primaryBlue,
    marginBottom: 20,
    textAlign: "center",
  },
});
