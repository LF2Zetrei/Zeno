import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

export default function CreerMissionScreen() {
  const [step, setStep] = useState<1 | 2>(1);

  // Section 1 : produit
  const [nomProduit, setNomProduit] = useState("");
  const [descriptionProduit, setDescriptionProduit] = useState("");
  const [prix, setPrix] = useState("");

  // Section 2 : mission
  const [destination, setDestination] = useState("");
  const [dateLivraison, setDateLivraison] = useState("");

  const handleNext = () => {
    if (!nomProduit || !descriptionProduit || !prix) {
      Alert.alert(
        "Champs requis",
        "Merci de remplir tous les champs du produit."
      );
      return;
    }
    setStep(2);
  };

  const handleSubmit = () => {
    if (!destination || !dateLivraison) {
      Alert.alert("Champs requis", "Merci de compléter la mission.");
      return;
    }

    const payload = {
      produit: {
        nom: nomProduit,
        description: descriptionProduit,
        prix: parseFloat(prix),
      },
      mission: {
        destination,
        dateLivraison,
      },
    };

    console.log("✅ Données prêtes pour l'API :", payload);
    Alert.alert("Mission créée", "Les données sont prêtes à être envoyées.");
    // TODO : appel à l'API ici
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Créer une mission</Text>

      {/* Étape 1 : Infos produit */}
      {step === 1 && (
        <>
          <Text style={styles.subtitle}>1. Infos produit</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom du produit"
            value={nomProduit}
            onChangeText={setNomProduit}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={descriptionProduit}
            onChangeText={setDescriptionProduit}
          />
          <TextInput
            style={styles.input}
            placeholder="Prix (€)"
            value={prix}
            onChangeText={setPrix}
            keyboardType="numeric"
          />
          <Button title="Suivant ➜" onPress={handleNext} />
        </>
      )}

      {/* Étape 2 : Infos mission */}
      {step === 2 && (
        <>
          <Text style={styles.subtitle}>2. Infos mission</Text>
          <TextInput
            style={styles.input}
            placeholder="Destination"
            value={destination}
            onChangeText={setDestination}
          />
          <TextInput
            style={styles.input}
            placeholder="Date de livraison (JJ/MM/AAAA)"
            value={dateLivraison}
            onChangeText={setDateLivraison}
          />
          <Button title="Créer la mission ✅" onPress={handleSubmit} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
});
