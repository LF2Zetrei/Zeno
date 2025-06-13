import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { useMissions } from "../../hooks/mission/useMissions";
import { useMyMissions } from "../../hooks/mission/useMyMissions";
import { useUserByJwt } from "../../hooks/user/getUserByJwt";
import AcceptMissionButton from "../../components/AcceptMissionButton";
import UnassignMissionButton from "../../components/UnassignMissionButton";

export default function MissionsScreen() {
  const { missions: missionsFromHook, loading: loadingMissions } =
    useMissions();
  const { myMissions, loading: loadingMyMissions } = useMyMissions();
  const { user, loading: loadingUser } = useUserByJwt();

  // 1. Gérer les missions localement pour rendre la page dynamique
  const [missions, setMissions] = useState([]);

  // Synchroniser missions locales avec missions reçues
  useEffect(() => {
    setMissions(missionsFromHook);
  }, [missionsFromHook]);

  if (loadingMissions || loadingMyMissions || loadingUser) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Fonction appelée quand on accepte une mission
  const handleAcceptMission = (missionId) => {
    setMissions((prevMissions) =>
      prevMissions.map((m) =>
        m.idMission === missionId
          ? {
              ...m,
              travelerId: user.idUser,
              travelerPseudo: user.pseudo,
              status: "ACCEPTED", // ou le statut que tu veux
            }
          : m
      )
    );
  };

  // Fonction appelée quand on se retire d'une mission
  const handleUnassignMission = (missionId) => {
    setMissions((prevMissions) =>
      prevMissions.map((m) =>
        m.idMission === missionId
          ? {
              ...m,
              travelerId: null,
              travelerPseudo: null,
              status: "AVAILABLE", // ou le statut initial
            }
          : m
      )
    );
  };

  if (user.role === "USER") {
    return (
      <View style={{ padding: 20 }}>
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
