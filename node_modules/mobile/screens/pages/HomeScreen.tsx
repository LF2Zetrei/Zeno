import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import LogoutButton from "../../components/LogoutButton";
import { useUserByJwt } from "../../hooks/user/getUserByJwt";
import { useMissions } from "../../hooks/mission/useMissions";
import { useTrackingAutomatique } from "../../hooks/position/useRefreshPositionAuto";
import { useTrackingUserAutomatique } from "../../hooks/position/useRefreshUserPositionAuto.";

type Props = NativeStackScreenProps<RootStackParamList, "Accueil">;

export default function HomeScreen({ navigation }: Props) {
  const { user, loading: loadingUser } = useUserByJwt();
  const { missions, loading: loadingMissions } = useMissions();

  const missionsFiltrees = missions.filter(
    (mission) => mission.traveler?.idUser === user?.idUser
  );

  const missionIds = missionsFiltrees.map((mission) => mission.idMission);

  useTrackingAutomatique(missionIds);
  useTrackingUserAutomatique();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenue sur la page d'accueil !</Text>

      {(loadingUser || loadingMissions) && <ActivityIndicator />}

      <Text style={{ marginBottom: 10 }}>
        {missionIds.length > 0
          ? `Tracking actif pour ${missionIds.length} mission(s)`
          : "Aucune mission en cours à suivre"}
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>Mon profil :</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profil")}>
          <Text style={styles.linkText}>Voir mon profil</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Les missions :</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Missions")}>
          <Text style={styles.linkText}>Voir les missions</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Vos commandes:</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Orders")}>
          <Text style={styles.linkText}>Voir vos commandes</Text>
        </TouchableOpacity>
        <Text style={styles.label}>La carte :</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Map")}>
          <Text style={styles.linkText}>Voir la carte des missons</Text>
        </TouchableOpacity>
        <Text style={styles.label}>La messagerie :</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Contact")}>
          <Text style={styles.linkText}>Voir les contacts</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Créer vos missions :</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CreateMission")}>
          <Text style={styles.linkText}>Créer une mission</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Vos abonnements :</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Subscription")}>
          <Text style={styles.linkText}>Voir les offres</Text>
        </TouchableOpacity>
      </View>

      <LogoutButton />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  linkText: {
    color: "#007AFF",
    marginVertical: 4,
    fontSize: 15,
  },
});
