import React from "react";
import { View, Text } from "react-native";
import CreateOrderForm from "../CreateOrderForm";

type Props = {
  onOrderCreated: (order: any) => void;
};

export default function CreateOrderStep({ onOrderCreated }: Props) {
  return (
    <View>
      <Text>Étape 1 : Créer une commande</Text>
      <CreateOrderForm onOrderCreated={onOrderCreated} />
    </View>
  );
}
