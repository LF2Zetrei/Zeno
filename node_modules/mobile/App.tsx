import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation";
import HomeScreen from "./screens/pages/HomeScreen";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import RegisterScreen from "./screens/pages/RegisterScreen";
import ConnexionScreen from "./screens/pages/ConnexionScreen";
import ProfilScreen from "./screens/pages/ProfilScreen";
import ListeMissionsScreen from "./screens/pages/ListeMissionsScreen";
import CarteMissionsScreen from "./screens/pages/CarteMissionsScreen";
import ContactsScreen from "./screens/pages/ContactsScreen";
import MessagerieScreen from "./screens/pages/MessagerieScreen";
import OrderWizard from "./screens/pages/CreerMissionsScreen";
import ListeOrderScreen from "./screens/pages/ListeOrdersScreen";
import SubscriptionScreen from "./screens/pages/SubscriptionScreen";
import RoleScreen from "./screens/pages/RoleScreen";
import UserRatingScreen from "./screens/pages/UserRatingScreen";

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
          <Stack.Screen name="Map" component={CarteMissionsScreen} />
          <Stack.Screen name="Contact" component={ContactsScreen} />
          <Stack.Screen name="Messagerie" component={MessagerieScreen} />
          <Stack.Screen name="CreateMission" component={OrderWizard} />
          <Stack.Screen name="Orders" component={ListeOrderScreen} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} />
          <Stack.Screen name="Role" component={RoleScreen} />
          <Stack.Screen name="Rating" component={UserRatingScreen} />
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
