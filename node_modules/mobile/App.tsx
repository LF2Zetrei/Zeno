import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import DetailsScreen from "./screens/DetailScreen";
import ConnexionScreen from "./screens/ConnexionScreen";
import InscriptionScreen from "./screens/InscriptionScreen";
import { RootStackParamList } from "./types/navigation";
import CreerMissionScreen from "./screens/CreerMissionsScreen";
import ListeMissionsScreen from "./screens/ListeMissionsScreen";
import CarteMissionsScreen from "./screens/CarteMissionsScreen";
import MessagerieScreen from "./screens/MessagerieScreen";
import ContactsScreen from "./screens/ContactsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Accueil"
        screenOptions={{ headerShown: true }}
      >
        <Stack.Screen name="Accueil" component={HomeScreen} />
        <Stack.Screen name="Détails" component={DetailsScreen} />
        <Stack.Screen name="Connexion" component={ConnexionScreen} />
        <Stack.Screen name="Inscription" component={InscriptionScreen} />
        <Stack.Screen name="CreerMissions" component={CreerMissionScreen} />
        <Stack.Screen name="ListeMissions" component={ListeMissionsScreen} />
        <Stack.Screen name="CarteMissions" component={CarteMissionsScreen} />
        <Stack.Screen name="Messagerie" component={MessagerieScreen} />
        <Stack.Screen name="Contacts" component={ContactsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
