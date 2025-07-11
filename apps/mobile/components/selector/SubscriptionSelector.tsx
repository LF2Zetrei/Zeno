import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserByJwt } from "../../hooks/user/getUserByJwt";
import { useStripe } from "@stripe/stripe-react-native";

const SubscriptionSelector = () => {
  const { user, loading: userLoading } = useUserByJwt();
  const [loading, setLoading] = useState(false);
  const [localUser, setLocalUser] = useState<any>(null);

  const API_URL = Constants.expoConfig?.extra?.apiUrl;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    if (user && !localUser) {
      setLocalUser(user);
    }
  }, [user]);

  const handleSubscription = async (
    subscriptionType: "basic" | "premium",
    action: "subscribe" | "unsubscribe"
  ) => {
    const confirmText =
      action === "subscribe"
        ? `Souhaitez-vous acheter le pass ${subscriptionType.toUpperCase()} ?`
        : `Souhaitez-vous vous retirer de l'offre ${subscriptionType.toUpperCase()} ?`;

    Alert.alert("Confirmation", confirmText, [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Confirmer",
        onPress: async () => {
          setLoading(true);
          const token = await AsyncStorage.getItem("token");
          let paymentIntentId: string | null = null;

          try {
            if (action === "subscribe") {
              const paymentRoute =
                subscriptionType === "premium" ? "premiumPass" : "classicPass";

              const res = await fetch(`${API_URL}payment/${paymentRoute}`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });

              const { clientSecret, paymentIntentId: fetchedPaymentIntentId } =
                await res.json();
              paymentIntentId = fetchedPaymentIntentId;

              const merchantDisplayName =
                Constants.expoConfig?.extra?.merchantDisplayName || "Zeno";

              const { error: initError } = await initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName,
              });

              if (initError) throw new Error(initError.message);

              const { error: paymentError } = await presentPaymentSheet();

              if (paymentError) throw new Error(paymentError.message);
            }

            const body: any = { subscriptionType };
            if (paymentIntentId) body.paymentIntentId = paymentIntentId;

            const response = await fetch(`${API_URL}user/subscription`, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error("Échec de la mise à jour");

            const now = new Date().toISOString();
            setLocalUser((prev: any) => {
              const updated = { ...prev };
              if (subscriptionType === "basic") {
                updated.basicSubscription = action === "subscribe";
                updated.basicSubscriptionSince =
                  action === "subscribe" ? now : null;
              } else {
                updated.premiumSubscription = action === "subscribe";
                updated.premiumSubscriptionSince =
                  action === "subscribe" ? now : null;
              }
              return updated;
            });

            Alert.alert(
              "Succès",
              `Abonnement ${
                action === "subscribe" ? "ajouté" : "annulé"
              } (${subscriptionType})`
            );
          } catch (error: any) {
            Alert.alert("Erreur", error.message || "Une erreur est survenue");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  if (userLoading || !localUser) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={styles.primaryColor.color} />
      </View>
    );
  }

  const {
    basicSubscription,
    premiumSubscription,
    basicSubscriptionSince,
    premiumSubscriptionSince,
  } = localUser;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des abonnements</Text>

      <View style={styles.subscriptionContainer}>
        {!basicSubscription && (
          <View
            style={[styles.subscriptionBox, { backgroundColor: "#2f167f" }]}
          >
            <Text style={styles.passTitle}>Pass BASIC</Text>
            <Text style={styles.passDescription}>
              Accès aux fonctionnalités de base.
            </Text>
            <Text style={styles.passPrice}>€5 / mois</Text>
            <Button
              title="Acheter le pass BASIC"
              onPress={() => handleSubscription("basic", "subscribe")}
              color={styles.fuchsia.color}
            />
          </View>
        )}

        {!premiumSubscription && (
          <View
            style={[styles.subscriptionBox, { backgroundColor: "#cb157c" }]}
          >
            <Text style={styles.passTitle}>Pass PREMIUM</Text>
            <Text style={styles.passDescription}>
              Accès à toutes les fonctionnalités.
            </Text>
            <Text style={styles.passPrice}>€15 / mois</Text>
            <Button
              title="Acheter le pass PREMIUM"
              onPress={() => handleSubscription("premium", "subscribe")}
              color={styles.yellow.color}
            />
          </View>
        )}
      </View>

      {basicSubscription && (
        <>
          <Text style={styles.info}>
            Abonné à BASIC depuis le :{" "}
            {new Date(basicSubscriptionSince).toLocaleDateString()}
          </Text>
          <Button
            title="Se retirer de BASIC"
            color={styles.red.color}
            onPress={() => handleSubscription("basic", "unsubscribe")}
          />
        </>
      )}

      {premiumSubscription && (
        <>
          <Text style={styles.info}>
            Abonné à PREMIUM depuis le :{" "}
            {new Date(premiumSubscriptionSince).toLocaleDateString()}
          </Text>
          <Button
            title="Se retirer de Premium"
            color={styles.red.color}
            onPress={() => handleSubscription("premium", "unsubscribe")}
          />
        </>
      )}

      {loading && (
        <ActivityIndicator size="large" color={styles.primaryColor.color} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2f167f", // Bleu nuit
  },
  info: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 8,
    color: "#869962", // Vert olive
  },
  subscriptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  subscriptionBox: {
    padding: 20,
    borderRadius: 10,
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.9,
  },
  passTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  passDescription: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 12,
  },
  passPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  primaryColor: {
    color: "#2f167f",
  },
  fuchsia: {
    color: "#cb157c",
  },
  yellow: {
    color: "#ffb01b",
  },
  red: {
    color: "#ff0000",
  },
});

export default SubscriptionSelector;
