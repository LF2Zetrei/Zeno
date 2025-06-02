import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation";
import HomeScreen from "./screens/HomeScreen";
import ConnexionScreen from "./screens/ConnexionScreen";
import InscriptionScreen from "./screens/InscriptionScreen";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import DetailsScreen from "./screens/DetailScreen";
import CreerMissionScreen from "./screens/CreerMissionsScreen";
import ListeMissionsScreen from "./screens/ListeMissionsScreen";
import CarteMissionsScreen from "./screens/CarteMissionsScreen";
import MessagerieScreen from "./screens/MessagerieScreen";
import ContactsScreen from "./screens/ContactsScreen";

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

          <Stack.Screen name="Détails" component={DetailsScreen} />
          <Stack.Screen name="CreerMissions" component={CreerMissionScreen} />
          <Stack.Screen name="ListeMissions" component={ListeMissionsScreen} />
          <Stack.Screen name="CarteMissions" component={CarteMissionsScreen} />
          <Stack.Screen name="Messagerie" component={MessagerieScreen} />
          <Stack.Screen name="Contacts" component={ContactsScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Connexion" component={ConnexionScreen} />
          <Stack.Screen name="Inscription" component={InscriptionScreen} />
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
