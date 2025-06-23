import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList, Button } from "react-native";
import { useMissions } from "../../hooks/mission/useMissions";
import { useMyMissions } from "../../hooks/mission/useMyMissions";
import { useUserByJwt } from "../../hooks/user/getUserByJwt";
import AcceptMissionButton from "../../components/AcceptMissionButton";
import UnassignMissionButton from "../../components/UnassignMissionButton";
import { useMissionState } from "../../hooks/mission/useMissionState";

export default function MissionsScreen() {
  const { missions: missionsFromHook, loading: loadingMissions } =
    useMissions();
  const { missions: myMissions, loading: loadingMyMissions } = useMyMissions();
  const { user, loading: loadingUser } = useUserByJwt();
  const [showMyMissions, setShowMyMissions] = useState(false);
  const { updateMissionStatus, loading, error, success } = useMissionState();

  const [missions, setMissions] = useState([]);

  useEffect(() => {
    setMissions(missionsFromHook);
  }, [missionsFromHook]);

  if (loadingMissions || loadingMyMissions || loadingUser) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

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

  // 🔁 Si showMyMissions est activé → on affiche uniquement mes missions
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
                  <Button
                    title="Valider la mission"
                    onPress={() => handleValidatingMisson(item.idMission)}
                    disabled={loading}
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

  // Sinon → comportement habituel selon le rôle
  if (user.role === "USER") {
    return (
      <View style={{ padding: 20 }}>
        <Button
          title="Afficher mes missions"
          onPress={() => setShowMyMissions(true)}
        />
        {missions.length === 0 ? (
          <Text>Aucune mission trouvée</Text>
        ) : (
          <FlatList
            data={missions}
            keyExtractor={(item) => item.idMission}
            renderItem={({ item }) => (
              <>
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
              </>
            )}
          />
        )}
      </View>
    );
  }

  if (user.role === "DELIVER") {
    return (
      <View style={{ padding: 20 }}>
        <Button
          title="Afficher mes missions"
          onPress={() => setShowMyMissions(true)}
        />
        {missions.length === 0 ? (
          <Text>Aucune mission trouvée</Text>
        ) : (
          <FlatList
            data={missions}
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
    );
  }
}
