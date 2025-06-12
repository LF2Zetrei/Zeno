import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

const API_BASE = "http://192.168.0.20:8080/api";
const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0ODk1NzUyNCwiZXhwIjoxNzQ4OTYxMTI0fQ.pmkXn9lnnV2LXdLWWb2QIB3JnmFVkNSegjQSHcSHvqQ";

export default function OrderWizard() {
  const [step, setStep] = useState(1);

  // Étape 1: création de la commande
  const [orderData, setOrderData] = useState({
    purchaseAddress: "",
    purchaseCountry: "",
    deadline: "",
    artisanName: "",
    city: "",
  });
  const [orderId, setOrderId] = useState(null);

  // Étape 2: produits
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Création produit
  const [newProductData, setNewProductData] = useState({
    name: "",
    description: "",
    photoUrl: "",
    weight: "",
    quantity: "",
    estimatedPrice: "",
  });

  // Charger la liste des produits
  useEffect(() => {
    if (step === 2) {
      fetchProducts();
    }
  }, [step]);

  async function fetchProducts() {
    setLoadingProducts(true);
    try {
      const res = await fetch(`${API_BASE}/product`, {
        headers: { Authorization: TOKEN },
      });
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger la liste des produits.");
    }
    setLoadingProducts(false);
  }

  // Soumettre la commande (étape 1)
  async function createOrder() {
    try {
      const res = await fetch(`${API_BASE}/order/create`, {
        method: "POST",
        headers: {
          Authorization: TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) throw new Error("Erreur création commande");
      const createdOrder = await res.json();
      setOrderId(createdOrder.id); // supposé que l'API retourne l'id de la commande
      setStep(2);
    } catch (error) {
      Alert.alert("Erreur", "La création de la commande a échoué.");
    }
  }

  // Soumettre un nouveau produit (étape 2)
  async function createProduct() {
    try {
      const body = {
        ...newProductData,
        weight: Number(newProductData.weight),
        quantity: Number(newProductData.quantity),
        estimatedPrice: Number(newProductData.estimatedPrice),
      };
      const res = await fetch(`${API_BASE}/product`, {
        method: "POST",
        headers: {
          Authorization: TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Erreur création produit");
      const createdProduct = await res.json();
      setSelectedProductId(createdProduct.id);
      setStep(3);
    } catch (error) {
      Alert.alert("Erreur", "La création du produit a échoué.");
    }
  }

  // Ajouter produit à la commande (étape 3)
  async function addProductToOrder() {
    if (!orderId || !selectedProductId) {
      Alert.alert("Erreur", "Commande ou produit invalide.");
      return;
    }
    try {
      const res = await fetch(
        `${API_BASE}/order/${orderId}/product/${selectedProductId}`,
        {
          method: "POST",
          headers: {
            Authorization: TOKEN,
          },
        }
      );
      if (!res.ok) throw new Error("Erreur ajout produit à la commande");
      Alert.alert("Succès", "Produit ajouté à la commande.");
      // Reset ou naviguer ailleurs...
      setStep(1);
      setOrderData({
        purchaseAddress: "",
        purchaseCountry: "",
        deadline: "",
        artisanName: "",
        city: "",
      });
      setSelectedProductId(null);
      setNewProductData({
        name: "",
        description: "",
        photoUrl: "",
        weight: "",
        quantity: "",
        estimatedPrice: "",
      });
    } catch (error) {
      Alert.alert("Erreur", "Impossible d’ajouter le produit à la commande.");
    }
  }

  // UI pour chaque étape
  if (step === 1) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Étape 1 : Créer une commande</Text>
        {[
          "purchaseAddress",
          "purchaseCountry",
          "deadline",
          "artisanName",
          "city",
        ].map((field) => (
          <TextInput
            key={field}
            placeholder={field}
            value={orderData[field]}
            onChangeText={(text) =>
              setOrderData((prev) => ({ ...prev, [field]: text }))
            }
            style={{ borderWidth: 1, marginVertical: 5, padding: 8 }}
          />
        ))}
        <Button title="Créer la commande" onPress={createOrder} />
      </View>
    );
  }

  if (step === 2) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Étape 2 : Choisir ou créer un produit</Text>

        <Text style={{ fontWeight: "bold", marginTop: 10 }}>
          Créer un produit :
        </Text>
        {[
          "name",
          "description",
          "photoUrl",
          "weight",
          "quantity",
          "estimatedPrice",
        ].map((field) => (
          <TextInput
            key={field}
            placeholder={field}
            value={newProductData[field]}
            onChangeText={(text) =>
              setNewProductData((prev) => ({ ...prev, [field]: text }))
            }
            style={{ borderWidth: 1, marginVertical: 5, padding: 8 }}
            keyboardType={
              ["weight", "quantity", "estimatedPrice"].includes(field)
                ? "numeric"
                : "default"
            }
          />
        ))}
        <Button title="Créer ce produit" onPress={createProduct} />

        <Text style={{ fontWeight: "bold", marginTop: 20 }}>
          Ou choisir un produit existant :
        </Text>
        {loadingProducts ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor:
                    selectedProductId === item.id ? "#ddd" : "#fff",
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                }}
                onPress={() => {
                  setSelectedProductId(item.id);
                  setStep(3);
                }}
              >
                <Text>{item.name}</Text>
                <Text style={{ fontSize: 12, color: "#666" }}>
                  {item.description}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  }

  if (step === 3) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Étape 3 : Ajouter le produit à la commande</Text>
        <Button
          title="Ajouter le produit à la commande"
          onPress={addProductToOrder}
        />
        <Button
          title="Retour à la sélection produit"
          onPress={() => setStep(2)}
        />
      </View>
    );
  }

  return null;
}
