import React from "react";
import { View, Text } from "react-native";
import PublishOrderButton from "../PublishOrderButton";

type Props = {
  orderId: string;
  productId: string;
  onSuccess: () => void;
};

export default function SummaryStep({ orderId, productId, onSuccess }: Props) {
  return (
    <View>
      <Text>Étape 4 : Résumé</Text>
      <Text>
        Commande #{orderId} a bien été mise à jour avec le produit #{productId}.
      </Text>
      <PublishOrderButton orderId={orderId} onSuccess={onSuccess} />
    </View>
  );
}
