import React from "react";
import { ScrollView, StyleSheet, ImageBackground } from "react-native";
import RegisterForm from "../../components/form/RegisterForm";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

export default function RegisterScreen() {
  return (
    <BlurView intensity={100} tint="light" style={StyleSheet.absoluteFill}>
      <ScrollView contentContainerStyle={styles.overlay}>
        <SafeAreaView>
          <RegisterForm />
        </SafeAreaView>
      </ScrollView>
    </BlurView>
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
    backgroundColor: "rgba(181, 171, 171, 0.3)",
  },
});
