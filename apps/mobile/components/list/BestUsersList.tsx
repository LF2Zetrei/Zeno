import React from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { useBestUsers } from "../../hooks/user/useBestUsers";

const BestUsersList = () => {
  const { users, loading } = useBestUsers();

  if (loading) return <ActivityIndicator size="large" color="#000" />;

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.idUser}
      renderItem={({ item }) => (
        <View style={{ padding: 16 }}>
          <Text style={{ fontWeight: "bold" }}>
            {item.pseudo || item.email}
          </Text>
          <Text>Note : {item.ratingAverage ?? "Non noté"}</Text>
          <Text>Rôle : {item.role}</Text>
        </View>
      )}
    />
  );
};

export default BestUsersList;
