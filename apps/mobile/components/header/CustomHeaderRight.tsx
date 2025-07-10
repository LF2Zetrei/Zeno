// components/CustomHeaderRight.tsx
import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";

export default function CustomHeaderRight() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Profil")}>
      <Image
        source={require("../../assets/avatar/avatar.png")} // mets ton image ici
        style={{ width: 32, height: 32, borderRadius: 16, marginRight: 10 }}
      />
    </TouchableOpacity>
  );
}
