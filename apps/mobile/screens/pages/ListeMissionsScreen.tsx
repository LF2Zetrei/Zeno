import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

type Mission = {
  idMission: string;
  orderId: string;
  // autres champs...
};

type Order = {
  idOrder: string;
  purchaseAddress: string;
  deadline: string;
  artisanName: string;
  city: string;
  // autres champs...
};

type Product = {
  id: string;
  name: string;
  // autres champs...
};

const BASE_URL = "http://192.168.0.20:8080/api/";
const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0ODg3NDAxMywiZXhwIjoxNzQ4ODc3NjEzfQ.4jHvQzTVFjWMY4wXz-lWBRjL0PunWLcfDYAq8MLuzOo";

export default function ListeMissionsScreen() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dictionnaire missionId -> détails commande + produits
  const [orderDetails, setOrderDetails] = useState<{
    [missionId: string]: { order: Order | null; products: Product[] };
  }>({});

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res = await fetch(`${BASE_URL}mission`, {
          headers: { Authorization: TOKEN },
        });
        if (!res.ok) throw new Error("Erreur chargement missions");
        const data: Mission[] = await res.json();
        setMissions(data);

        // Pour chaque mission, charger la commande et ses produits
        data.forEach(async (mission) => {
          try {
            // Charger la commande
            const orderRes = await fetch(
              `${BASE_URL}order/${mission.orderId}`,
              {
                headers: { Authorization: TOKEN },
              }
            );
            if (!orderRes.ok) throw new Error("Erreur chargement commande");
            const orderData: Order = await orderRes.json();

            // Charger les produits de la commande
            const prodRes = await fetch(
              `${BASE_URL}order/${mission.orderId}/products`,
              {
                headers: { Authorization: TOKEN },
              }
            );
            if (!prodRes.ok) throw new Error("Erreur chargement produits");
            const productsData: Product[] = await prodRes.json();

            // Stocker dans l’état
            setOrderDetails((old) => ({
              ...old,
              [mission.idMission]: { order: orderData, products: productsData },
            }));
          } catch (e) {
            console.warn("Erreur chargement commande/produits", e);
          }
        });
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  const renderMission = ({ item }: { item: Mission }) => {
    const details = orderDetails[item.idMission];
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Mission ID: {item.idMission}</Text>
        <Text>Order ID: {item.orderId}</Text>

        {details ? (
          <>
            <Text>Artisan: {details.order?.artisanName}</Text>
            <Text>Adresse d'achat: {details.order?.purchaseAddress}</Text>
            <Text>Deadline: {details.order?.deadline}</Text>
            <Text>Ville: {details.order?.city}</Text>

            <Text style={{ marginTop: 8, fontWeight: "bold" }}>Produits:</Text>
            {details.products.length > 0 ? (
              details.products.map((p) => <Text key={p.id}>- {p.name}</Text>)
            ) : (
              <Text>(Aucun produit)</Text>
            )}
          </>
        ) : (
          <Text>Chargement commande...</Text>
        )}
      </View>
    );
  };

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;

  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>📦 Missions disponibles</Text>
      <FlatList
        data={missions}
        keyExtractor={(item) => item.idMission}
        renderItem={renderMission}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#f4f4f4",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  list: { paddingBottom: 20 },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: { fontWeight: "bold", marginBottom: 6, fontSize: 16 },
});
