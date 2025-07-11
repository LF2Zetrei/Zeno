// components/header/CustomHeaderRight.tsx
import React from "react";
import { TouchableOpacity, Image, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";

export default function CustomHeaderRight() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Profil")}>
      <View style={styles.avatarContainer}>
        <Image
          source={require("../../assets/avatar/avatar.png")}
          style={styles.avatar}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    marginRight: 10,
    padding: 2,
    borderWidth: 2,
    borderColor: "#cb157c", // fuchsia
    borderRadius: 20,
    backgroundColor: "#2f167f", // bleu nuit
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
