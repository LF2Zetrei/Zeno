import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation";
import HomeScreen from "./screens/test/HomeScreen";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import RegisterScreen from "./screens/test/RegisterScreen";
import ConnexionScreen from "./screens/test/ConnexionScreen";
import ProfilScreen from "./screens/test/ProfilScreen";
import EditProfilScreen from "./screens/test/EditProfilScreen";
import SubscriptionScreen from "./screens/test/SubscriptionScreen";
import UserRatingScreen from "./screens/test/UserRatingScreen";
import DeleteProfilScreen from "./screens/test/DeleteProfilScreen";
import CreateProductScreen from "./screens/test/CreateProductScreen";
import EditProductScreen from "./screens/test/EditProductScreen";
import DeleteProductScreen from "./screens/test/DeleteProductScreen";
import CreateOrderScreen from "./screens/test/CreateOrderScreen";
import EditOrderScreen from "./screens/test/EditOrderScreen";

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
