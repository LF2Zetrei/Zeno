// components/order/AddProductToOrderStep.tsx
import React from "react";
import { View, Text } from "react-native";
import AddProductToOrderButton from "../button/AddProductToOrderButton";

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
    <View>
      <Text>Étape 3 : Ajouter le produit à la commande</Text>
      <AddProductToOrderButton
        orderIda={orderId}
        productIda={productId}
        onSuccess={onSuccess}
      />
    </View>
  );
}
