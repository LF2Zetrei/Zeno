import React from "react";
import { ScrollView, ImageBackground, StyleSheet } from "react-native";
import ConnexionForm from "../../components/form/ConnexionForm";
import { BlurView } from "expo-blur";

export default function ConnexionScreen() {
  return (
    <ScrollView contentContainerStyle={styles.overlay}>
      <ConnexionForm />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    // optional: remove or reduce this to see the blur effect
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
});
