import React from "react";
import { ScrollView } from "react-native";
import DeleteProductButton from "../components/DeleteProduct";

export default function DeleteProductScreen() {
  return (
    <ScrollView>
      <DeleteProductButton productId="41ff9fe0-ae94-4930-8cf3-bd9560b941eb" />
    </ScrollView>
  );
}
