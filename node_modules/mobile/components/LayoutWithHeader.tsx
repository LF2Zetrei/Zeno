// components/LayoutWithHeader.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import CustomHeader from "./CustomHeader";

interface LayoutWithHeaderProps {
  children: React.ReactNode;
  title: string;
}

export default function LayoutWithHeader({
  children,
  title,
}: LayoutWithHeaderProps) {
  return (
    <View style={styles.container}>
      <CustomHeader title={title} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});
