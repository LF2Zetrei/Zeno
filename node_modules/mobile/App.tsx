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
import UserRatingScreen from "./screens/UserRatingScreen";
import DeleteProfilScreen from "./screens/DeleteProfilScreen";
import CreateProductScreen from "./screens/CreateProductScreen";
import EditProductScreen from "./screens/EditProductScreen";
import DeleteProductScreen from "./screens/DeleteProductScreen";
import CreateOrderScreen from "./screens/CreateOrderScreen";
import EditOrderScreen from "./screens/EditOrderScreen";

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
          <Stack.Screen name="Rate" component={UserRatingScreen} />
          <Stack.Screen name="Delete" component={DeleteProfilScreen} />
          <Stack.Screen name="CreateProduct" component={CreateProductScreen} />
          <Stack.Screen name="EditProduct" component={EditProductScreen} />
          <Stack.Screen name="DeleteProduct" component={DeleteProductScreen} />
          <Stack.Screen name="CreateOrder" component={CreateOrderScreen} />
          <Stack.Screen name="EditOrder" component={EditOrderScreen} />
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
