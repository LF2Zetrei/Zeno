import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList, Button } from "react-native";
import Slider from "@react-native-community/slider";
import { useMissions } from "../../hooks/mission/useMissions";
import { useMyMissions } from "../../hooks/mission/useMyMissions";
import { useUserByJwt } from "../../hooks/user/getUserByJwt";
import AcceptMissionButton from "../../components/AcceptMissionButton";
import UnassignMissionButton from "../../components/UnassignMissionButton";
import { useMissionState } from "../../hooks/mission/useMissionState";
import { useNearbyMissions } from "../../hooks/mission/getMissionsNearby";
import DeliveredMissionButton from "../../components/button/DeliveredMissionButton";

export default function MissionsScreen() {
  const { missions: missionsFromHook, loading: loadingMissions } =
    useMissions();
  const { missions: myMissions, loading: loadingMyMissions } = useMyMissions();
  const { user, loading: loadingUser } = useUserByJwt();
  const { updateMissionStatus, loading, error, success } = useMissionState();

  const [missions, setMissions] = useState([]);
  const [showMyMissions, setShowMyMissions] = useState(false);
  const [showNearbyMissions, setShowNearbyMissions] = useState(false);
  const [radiusKm, setRadiusKm] = useState(10);

  const {
    missions: nearbyMissions,
    loading: loadingNearby,
    error: errorNearby,
  } = useNearbyMissions(radiusKm);

  useEffect(() => {
    setMissions(missionsFromHook);
  }, [missionsFromHook]);

  const handleValidatingMisson = async (missionId) => {
    await updateMissionStatus(missionId, "COMPLETED");
  };

  const handleAcceptMission = (missionId) => {
    setMissions((prevMissions) =>
      prevMissions.map((m) =>
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

  const handleUnassignMission = (missionId) => {
    setMissions((prevMissions) =>
      prevMissions.map((m) =>
        m.idMission === missionId
          ? {
              ...m,
              travelerId: null,
              travelerPseudo: null,
              status: "PENDING",
            }
          : m
      )
    );
  };

  if (loadingMissions || loadingMyMissions || loadingUser) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (showMyMissions) {
    return (
      <View style={{ padding: 20 }}>
        <Button
          title="Afficher toutes les missions"
          onPress={() => setShowMyMissions(false)}
        />
        {myMissions.length === 0 ? (
          <Text>Aucune mission trouvée</Text>
        ) : (
          <FlatList
            data={myMissions}
            keyExtractor={(item) => item.idMission}
            renderItem={({ item }) => (
              <View
                style={{
                  marginBottom: 15,
                  padding: 10,
                  backgroundColor: "#f0f0f0",
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  Mission : {item.idMission}
                </Text>
                <Text>Commande : {item.orderId}</Text>
                <Text>Statut : {item.status}</Text>
                <Text>
                  Créée le : {new Date(item.createdAt).toLocaleDateString()}
                </Text>
                {item.travelerPseudo && (
                  <Text>Voyageur : {item.travelerPseudo}</Text>
                )}
                {item.status != "COMPLETED" && (
                  <DeliveredMissionButton
                    missionId={item.idMission}
                    onSuccess={() => handleValidatingMisson(item.idMission)}
                  />
                )}
                {error && (
                  <Text style={{ color: "red" }}>Erreur : {error}</Text>
                )}
                {success && (
                  <Text style={{ color: "green" }}>
                    Mission validée avec succès !
                  </Text>
                )}
              </View>
            )}
          />
        )}
      </View>
    );
  }

  // Affichage pour tous les rôles (USER ou DELIVER)
  return (
    <View style={{ padding: 20 }}>
      <Button
        title="Afficher mes missions"
        onPress={() => setShowMyMissions(true)}
      />

      <Button
        title={
          showNearbyMissions
            ? "Cacher les missions proches"
            : "Afficher les missions proches"
        }
        onPress={() => setShowNearbyMissions(!showNearbyMissions)}
      />

      {showNearbyMissions && (
        <View style={{ marginVertical: 15 }}>
          <Text>Rayon de recherche : {radiusKm} km</Text>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={1}
            maximumValue={200}
            step={1}
            value={radiusKm}
            onValueChange={setRadiusKm}
            minimumTrackTintColor="#1EB1FC"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#1EB1FC"
          />
          {loadingNearby ? (
            <ActivityIndicator />
          ) : errorNearby ? (
            <Text style={{ color: "red" }}>{errorNearby}</Text>
          ) : nearbyMissions.length === 0 ? (
            <Text>Aucune mission à proximité</Text>
          ) : (
            <FlatList
              data={nearbyMissions}
              keyExtractor={(item) => item.idMission}
              renderItem={({ item }) => (
                <View
                  style={{
                    marginBottom: 15,
                    padding: 10,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    Mission : {item.idMission}
                  </Text>
                  <Text>Commande : {item.orderId}</Text>
                  <Text>Statut : {item.status}</Text>
                  <Text>
                    Créée le : {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                  {item.travelerPseudo && (
                    <Text>Voyageur : {item.travelerPseudo}</Text>
                  )}
                </View>
              )}
            />
          )}
        </View>
      )}

      {!showNearbyMissions && missions.length === 0 ? (
        <Text>Aucune mission trouvée</Text>
      ) : (
        !showNearbyMissions && (
          <FlatList
            data={missions.filter((item) => item.travelerId === null)}
            keyExtractor={(item) => item.idMission}
            renderItem={({ item }) => (
              <View
                style={{
                  marginBottom: 15,
                  padding: 10,
                  backgroundColor: "#f0f0f0",
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  Mission : {item.idMission}
                </Text>
                <Text>Commande : {item.orderId}</Text>
                <Text>Statut : {item.status}</Text>
                <Text>
                  Créée le : {new Date(item.createdAt).toLocaleDateString()}
                </Text>
                {item.travelerPseudo && (
                  <Text>Voyageur : {item.travelerPseudo}</Text>
                )}

                <Text>
                  {String(item.travelerId) === String(user.idUser) ? (
                    <UnassignMissionButton
                      missionId={item.idMission}
                      onSuccess={() => handleUnassignMission(item.idMission)}
                    />
                  ) : (
                    <AcceptMissionButton
                      missionId={item.idMission}
                      onSuccess={() => handleAcceptMission(item.idMission)}
                    />
                  )}
                </Text>
              </View>
            )}
          />
        )
      )}
    </View>
  );
}
