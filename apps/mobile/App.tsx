import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation";
import HomeScreen from "./screens/pages/HomeScreen";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ActivityIndicator, View, Image } from "react-native";
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
import { StripeProvider } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import CustomHeaderRight from "./components/header/CustomHeaderRight";
import * as Font from "expo-font";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
    <Stack.Navigator
      screenOptions={{
        headerTitle: () => (
          <Image
            source={require("./assets/logo/logo-base-blanc.png")}
            style={{ width: 100, height: 40, resizeMode: "contain" }}
          />
        ),
        headerRight: () => <CustomHeaderRight />,
        headerBackground: () => (
          <Image
            source={require("./assets/background/meli_melo.png")} // Ton image de fond
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              resizeMode: "cover",
              opacity: 1,
            }}
          />
        ),
        headerTintColor: "#fff",
        headerTitleAlign: "left",
        headerShadowVisible: true,
      }}
    >
      {token ? (
        <>
          <Stack.Screen name="Accueil" component={HomeScreen} />
          <Stack.Screen
            name="Profil"
            component={ProfilScreen}
            options={{ headerTitle: "Profil", headerRight: undefined }}
          />
          <Stack.Screen
            name="Missions"
            component={ListeMissionsScreen}
            options={{ headerTitle: "Missions" }}
          />
          <Stack.Screen
            name="Carte"
            component={CarteMissionsScreen}
            options={{ headerTitle: "Carte" }}
          />
          <Stack.Screen
            name="Contact"
            component={ContactsScreen}
            options={{ headerTitle: "Contacts" }}
          />
          <Stack.Screen
            name="Messagerie"
            component={MessagerieScreen}
            options={{ headerTitle: "Messagerie" }}
          />
          <Stack.Screen
            name="CreateMission"
            component={OrderWizard}
            options={{ headerTitle: "Créer une mission" }}
          />
          <Stack.Screen
            name="Orders"
            component={ListeOrderScreen}
            options={{ headerTitle: "Commandes" }}
          />
          <Stack.Screen
            name="Subscription"
            component={SubscriptionScreen}
            options={{ headerTitle: "Les pass Zeno" }}
          />
          <Stack.Screen
            name="Role"
            component={RoleScreen}
            options={{ headerTitle: "Mes roles" }}
          />
          <Stack.Screen
            name="Rating"
            component={UserRatingScreen}
            options={{ headerTitle: "Noter un utilisateur" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Connexion"
            component={ConnexionScreen}
            options={{
              headerTitle: "",
              headerRight: undefined,
              headerBackTitle: "",
            }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              headerTitle: "",
              headerRight: undefined,
              headerBackTitle: "",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const MERCHANT_ID = Constants.expoConfig?.extra?.merchantId;
  const PUBLIC_KEY = Constants.expoConfig?.extra?.publicKey;

  const [fontsLoaded] = useFonts({
    Nunito: require("./assets/fonts/Nunito-Regular.ttf"),
    NunitoItalic: require("./assets/fonts/Nunito-Italic.ttf"),
    NunitoBold: require("./assets/fonts/Nunito-Bold.ttf"),
    MuseoModerno: require("./assets/fonts/MuseoModerno-Regular.ttf"),
    MuseoModernoBold: require("./assets/fonts/MuseoModerno-Bold.ttf"),
  });

  useEffect(() => {
    const handleDeepLink = (event: Linking.EventType) => {
      const url = event.url;
      const parsed = Linking.parse(url);
      const sessionId = parsed.queryParams?.session_id;

      if (sessionId) {
        console.log("Stripe verification session ID:", sessionId);
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => {
      subscription.remove();
    };
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <StripeProvider
      publishableKey={PUBLIC_KEY}
      merchantIdentifier={MERCHANT_ID}
    >
      <AuthProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <AppRoutes />
          </NavigationContainer>
        </SafeAreaProvider>
      </AuthProvider>
    </StripeProvider>
  );
}
