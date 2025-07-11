import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getOrderById } from "../../utils/getOrderById";

interface Mission {
  idMission: number;
  orderId: number;
  createdAt: string;
  travelerPseudo?: string;
  travelerId?: number;
}

interface MissionCardProps {
  mission: Mission;
  user: any;
  onAccept: (idMission: number) => void;
}

export default function MissionCard({
  mission,
  user,
  onAccept,
}: MissionCardProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const navigation = useNavigation<any>();

  const toggleCard = () => setExpanded(!expanded);

  const handleContact = async () => {
    try {
      const order = await getOrderById(mission.orderId);
      const contactId = order?.buyer?.idUser;
      const contactName = order?.buyer?.pseudo;

      if (contactId && contactName) {
        navigation.navigate("Messagerie", {
          contactId,
          contactName,
        });
      } else {
        Alert.alert("Erreur", "Impossible de récupérer l'utilisateur.");
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue.");
    }
  };

  return (
    <TouchableOpacity onPress={toggleCard} activeOpacity={0.9}>
      {!expanded ? (
        <ImageBackground
          source={{
            uri: "https://source.unsplash.com/600x300/?delivery,travel",
          }}
          style={styles.collapsedCard}
          imageStyle={{ borderRadius: 15 }}
        >
          <View style={styles.overlay}>
            <Text style={styles.missionId}>Mission #{mission.idMission}</Text>
          </View>
        </ImageBackground>
      ) : (
        <View style={styles.expandedCard}>
          <Text style={styles.expandedTitle}>Mission #{mission.idMission}</Text>
          <Text style={styles.text}>Commande liée : {mission.orderId}</Text>
          <Text style={styles.text}>
            Date de création :{" "}
            {new Date(mission.createdAt).toLocaleDateString()}
          </Text>
          {mission.travelerPseudo && (
            <Text style={styles.text}>Voyageur : {mission.travelerPseudo}</Text>
          )}
          <View style={styles.buttonsRow}>
            {!mission.travelerId && (
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => {
                  onAccept(mission.idMission);
                  toggleCard();
                }}
              >
                <Text style={styles.acceptText}>Accepter</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleContact}
            >
              <Text style={styles.contactText}>Contacter</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  collapsedCard: {
    height: 180,
    marginBottom: 20,
    justifyContent: "flex-end",
    borderRadius: 15,
    overflow: "hidden",
  },
  overlay: {
    backgroundColor: "rgba(5,2,18,0.6)", // Presque noir avec transparence
    padding: 15,
    alignItems: "center",
  },
  missionId: {
    color: "#ffb01b", // Jaune soleil (accent)
    fontSize: 20,
    fontWeight: "bold",
  },
  expandedCard: {
    backgroundColor: "#fdfdfd",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: "#cb157c", // Rose fuchsia
  },
  expandedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2f167f", // Bleu nuit
    marginBottom: 10,
  },
  text: {
    color: "#050212", // Presque noir
    marginVertical: 4,
    fontSize: 14,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  acceptButton: {
    backgroundColor: "#cb157c", // Rose fuchsia
    padding: 12,
    borderRadius: 10,
    flex: 0.48,
    alignItems: "center",
  },
  contactButton: {
    backgroundColor: "#2f167f", // Bleu nuit
    padding: 12,
    borderRadius: 10,
    flex: 0.48,
    alignItems: "center",
  },
  acceptText: {
    color: "#fff",
    fontWeight: "600",
  },
  contactText: {
    color: "#fff",
    fontWeight: "600",
  },
});
