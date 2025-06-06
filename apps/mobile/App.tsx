import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation";
import HomeScreen from "./screens/HomeScreen";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import RegisterScreen from "./screens/RegisterScreen";
import ConnexionScreen from "./screens/ConnexionScreen";
import ProfilScreen from "./screens/ProfilScreen";
import EditProfilScreen from "./screens/EditProfilScreen";
import SubscriptionScreen from "./screens/SubscriptionScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppRoutes() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {token ? (
        <>
          <Stack.Screen name="Accueil" component={HomeScreen} />
          <Stack.Screen name="Profil" component={ProfilScreen} />
          <Stack.Screen name="EditProfil" component={EditProfilScreen} />
          <Stack.Screen name="Sub" component={SubscriptionScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Connexion" component={ConnexionScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </AuthProvider>
  );
}
