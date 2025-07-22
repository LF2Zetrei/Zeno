import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import CreateOrderStep from "../../components/step/CreateOrderStep";
import SelectOrCreateProductStep from "../../components/step/SelectOrCreateProductStep";
import AddProductToOrderStep from "../../components/step/AddProductToOrderStep";
import SummaryStep from "../../components/step/SummaryStep";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderWizard() {
  const route = useRoute();
  const initialOrderId = route.params?.orderId ?? null;

  const [step, setStep] = useState(initialOrderId ? 2 : 1);
  const [productId, setProductId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(initialOrderId);

  const handleOrderCreated = (order: any) => {
    setOrderId(order.idOrder);
    setStep(2);
  };

  const handleProductCreated = (product: any) => {
    setProductId(product.idProduct);
    setStep(3);
  };

  const handleSuccess = () => {
    navigation.navigate("Accueil");
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        {step === 1 && <CreateOrderStep onOrderCreated={handleOrderCreated} />}
        {step === 2 && (
          <SelectOrCreateProductStep
            onProductSelected={handleProductCreated}
            selectedProductId={productId}
          />
        )}
        {step === 3 && orderId && productId && (
          <AddProductToOrderStep
            orderId={orderId}
            productId={productId}
            onSuccess={() => setStep(4)}
          />
        )}
        {step === 4 && orderId && productId && (
          <SummaryStep
            orderId={orderId}
            productId={productId}
            onSuccess={handleSuccess}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
