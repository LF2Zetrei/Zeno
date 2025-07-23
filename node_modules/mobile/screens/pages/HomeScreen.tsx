import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import LogoutButton from "../../components/button/LogoutButton";
import { useUserByJwt } from "../../hooks/user/getUserByJwt";
import { useMyMissions } from "../../hooks/mission/useMyMissions";
import { useTrackingAutomatique } from "../../hooks/position/useRefreshPositionAuto";
import { useTrackingUserAutomatique } from "../../hooks/position/useRefreshUserPositionAuto.";

type Props = NativeStackScreenProps<RootStackParamList, "Accueil">;

// [Pas de changement dans l'import]

const COLORS = {
  primaryBlue: "#2f167f",
  primaryPink: "#cb157c",
  primaryYellow: "#ffb01b",
  secondaryOlive: "#869962",
  secondaryFluo: "#fcff00",
  dark: "#050212",
  background: "#fff",
  card: "#f4f4f8",
};

export default function HomeScreen({ navigation }: Props) {
  const { user, loading: loadingUser } = useUserByJwt();
  const { missions, loading: loadingMissions } = useMyMissions();
  console.log("User : ", user);
  const missionIds = missions.map((mission) => mission.idMission);

  useTrackingAutomatique(missionIds);
  useTrackingUserAutomatique();

  const heure = new Date().getHours();
  const salutation =
    heure < 12 ? "Bonjour" : heure < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Bandeau de bienvenue */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          {salutation}, {user?.pseudo || "voyageur"} 👋
        </Text>
        <Text style={styles.subText}>
          Que souhaitez-vous faire aujourd'hui ?
        </Text>
      </View>

      {(loadingUser || loadingMissions) && (
        <ActivityIndicator color={COLORS.primaryPink} />
      )}

      {/* Suivi des missions */}
      <View
        style={[
          styles.trackingStatus,
          {
            backgroundColor:
              missionIds.length > 0 ? COLORS.secondaryOlive : "#f8d7da",
          },
        ]}
      >
        <Text style={styles.trackingText}>
          {missionIds.length > 0
            ? `🔵 Tracking actif : ${missionIds.length} mission(s)`
            : "🟡 Aucune mission en cours"}
        </Text>
      </View>

      {/* Menu */}
      {!loadingUser && user && (
        <View style={styles.menu}>
          {user.role !== "USER" && (
            <MenuCard
              label="Missions"
              desc="Voir les missions"
              onPress={() => navigation.navigate("Missions")}
            />
          )}
          <MenuCard
            label="Commandes"
            desc="Voir vos commandes"
            onPress={() => navigation.navigate("Orders")}
          />
          <MenuCard
            label="Carte"
            desc="Carte des missions"
            onPress={() => navigation.navigate("Carte")}
          />
          <MenuCard
            label="Messagerie"
            desc="Voir vos messages"
            onPress={() => navigation.navigate("Contact")}
          />
          <MenuCard
            label="Créer mission"
            desc="Créer une mission"
            onPress={() => navigation.navigate("CreateMission")}
          />
          <MenuCard
            label="Abonnements"
            desc="Voir les offres"
            onPress={() => navigation.navigate("Subscription")}
          />
        </View>
      )}

      {/* Mascotte toucan */}
      <View style={styles.mascotSection}>
        <Image
          source={require("../../assets/mascotte/toucan-vole.png")}
          style={styles.toucanImage}
        />
        <Text style={styles.toucanQuote}>
          “Lancez-vous dans la quête de l'introuvable!”
        </Text>
      </View>

      <LogoutButton />
    </ScrollView>
  );
}

function MenuCard({
  label,
  desc,
  onPress,
}: {
  label: string;
  desc: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardTitle}>{label}</Text>
      <Text style={styles.cardDesc}>{desc}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    color: COLORS.primaryBlue,
    textAlign: "center",
    fontFamily: "NunitoBold",
  },
  subText: {
    fontSize: 16,
    color: COLORS.dark,
    textAlign: "center",
    marginTop: 5,
    fontFamily: "Nunito",
  },
  trackingStatus: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 20,
    width: "100%",
  },
  trackingText: {
    textAlign: "center",
    fontWeight: "600",
    color: COLORS.dark,
    fontFamily: "Nunito",
  },
  menu: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 30,
    width: "100%",
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    width: "47%",
    borderWidth: 1.5,
    borderColor: COLORS.primaryPink,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    color: COLORS.primaryBlue,
    marginBottom: 6,
    fontFamily: "MuseoModernoBold",
  },
  cardDesc: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    fontFamily: "Nunito",
  },
  mascotSection: {
    alignItems: "center",
    marginVertical: 30,
  },
  toucanImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  toucanQuote: {
    fontStyle: "italic",
    color: COLORS.primaryPink,
    marginTop: 10,
    textAlign: "center",
    fontFamily: "NunitoItalic", // 👈 si tu veux l’italique
  },
});
