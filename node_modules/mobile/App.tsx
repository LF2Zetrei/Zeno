import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation";
import HomeScreen from "./screens/test/HomeScreen";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import RegisterScreen from "./screens/pages/RegisterScreen";
import ConnexionScreen from "./screens/pages/ConnexionScreen";
import ProfilScreen from "./screens/pages/ProfilScreen";
import ListeMissionsScreen from "./screens/pages/ListeMissionsScreen";

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
          <Stack.Screen name="Missions" component={ListeMissionsScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Connexion" component={ConnexionScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
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
