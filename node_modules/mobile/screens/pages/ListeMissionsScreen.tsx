import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useMissions } from "../../hooks/mission/useMissions";
import { useMyMissions } from "../../hooks/mission/useMyMissions";
import { useUserByJwt } from "../../hooks/user/getUserByJwt";
import AcceptMissionButton from "../../components/button/AcceptMissionButton";
import UnassignMissionButton from "../../components/button/UnassignMissionButton";
import { useMissionState } from "../../hooks/mission/useMissionState";
import { useNearbyMissions } from "../../hooks/mission/getMissionsNearby";
import DeliveredMissionButton from "../../components/button/DeliveredMissionButton";
import { useNavigation } from "@react-navigation/native";
import { getOrderById } from "../../utils/getOrderById";

export default function MissionsScreen() {
  const { missions: missionsFromHook, loading: loadingMissions } =
    useMissions();
  const { missions: myMissions, loading: loadingMyMissions } = useMyMissions();
  const { user, loading: loadingUser } = useUserByJwt();
  const { updateMissionStatus, loading, error, success } = useMissionState();
  const navigation = useNavigation();
  const [missions, setMissions] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all"); // "all", "my", "nearby"
  const [radiusKm, setRadiusKm] = useState(10);

  const {
    missions: nearbyMissions,
    loading: loadingNearby,
    error: errorNearby,
  } = useNearbyMissions(radiusKm);

  useEffect(() => {
    setMissions(missionsFromHook);
  }, [missionsFromHook]);

  const handleValidatingMission = async (missionId) => {
    await updateMissionStatus(missionId, "COMPLETED");
  };

  const handleAcceptMission = (missionId) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.idMission === missionId
          ? {
              ...m,
              travelerId: user.idUser,
              travelerPseudo: user.pseudo,
              status: "ACCEPTED",
            }
          : m
      )
    );
  };

  const renderMissionCard = (item) => (
    <View style={styles.missionCard}>
      <View style={styles.missionCardHeader}>
        <Text style={styles.missionTitle}>Mission : {item.idMission}</Text>
        <Text style={styles.missionStatus}>Statut : {item.status}</Text>
      </View>
      <Text style={styles.missionText}>Commande : {item.orderId}</Text>
      <Text style={styles.missionText}>
        Créée le : {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      {item.travelerPseudo && (
        <Text style={styles.missionText}>Voyageur : {item.travelerPseudo}</Text>
      )}
      {item.status !== "COMPLETED" &&
        String(item.travelerId) === String(user.idUser) && (
          <DeliveredMissionButton
            missionId={item.idMission}
            onSuccess={() => handleValidatingMission(item.idMission)}
          />
        )}
      {!item.travelerId && selectedTab === "all" && (
        <View style={{ marginTop: 10 }}>
          <AcceptMissionButton
            missionId={item.idMission}
            onSuccess={() => handleAcceptMission(item.idMission)}
          />
          <TouchableOpacity
            style={styles.msgButton}
            onPress={async () => {
              const order = await getOrderById(item.orderId);
              if (order && order.buyer.idUser) {
                navigation.navigate("Messagerie", {
                  contactId: order.buyer.idUser,
                  contactName: order.buyer.pseudo,
                });
              } else {
                alert("Impossible de récupérer l'acheteur.");
              }
            }}
          >
            <Text style={styles.msgButtonText}>Aller à la messagerie</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loadingMissions || loadingMyMissions || loadingUser) {
    return <ActivityIndicator size="large" color="#2f167f" />;
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      {/* Onglets */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "all" && styles.tabButtonSelected,
          ]}
          onPress={() => setSelectedTab("all")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "all" && styles.tabTextSelected,
            ]}
          >
            Toutes les missions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "my" && styles.tabButtonSelected,
          ]}
          onPress={() => setSelectedTab("my")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "my" && styles.tabTextSelected,
            ]}
          >
            Mes missions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "nearby" && styles.tabButtonSelected,
          ]}
          onPress={() => setSelectedTab("nearby")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "nearby" && styles.tabTextSelected,
            ]}
          >
            Missions proches
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenu */}
      <ScrollView style={{ marginTop: 20 }}>
        {selectedTab === "my" ? (
          myMissions.length === 0 ? (
            <Text>Aucune mission</Text>
          ) : (
            myMissions.map(renderMissionCard)
          )
        ) : selectedTab === "nearby" ? (
          <>
            <Text style={{ marginBottom: 5 }}>
              Rayon de recherche : {radiusKm} km
            </Text>
            <Slider
              style={{ width: "100%" }}
              minimumValue={1}
              maximumValue={200}
              step={1}
              value={radiusKm}
              onValueChange={setRadiusKm}
              minimumTrackTintColor="#cb157c"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#cb157c"
            />
            {loadingNearby ? (
              <ActivityIndicator color="#cb157c" />
            ) : nearbyMissions.length === 0 ? (
              <Text>Aucune mission à proximité</Text>
            ) : (
              nearbyMissions.map(renderMissionCard)
            )}
          </>
        ) : (
          missions.filter((m) => m.travelerId === null).map(renderMissionCard)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#eee",
    borderRadius: 10,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  tabButtonSelected: {
    backgroundColor: "#2f167f",
  },
  tabText: {
    color: "#2f167f",
    fontWeight: "600",
  },
  tabTextSelected: {
    color: "#fff",
  },
  missionCard: {
    backgroundColor: "#f9f9f9",
    borderLeftWidth: 5,
    borderLeftColor: "#cb157c",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  missionCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  missionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#050212",
  },
  missionStatus: {
    fontWeight: "600",
    color: "#869962",
  },
  missionText: {
    color: "#050212",
    marginVertical: 2,
  },
  msgButton: {
    marginTop: 10,
    backgroundColor: "#ffb01b",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  msgButtonText: {
    color: "#050212",
    fontWeight: "600",
  },
});
