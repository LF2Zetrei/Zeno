import React from "react";
import { View } from "react-native";
import UserRating from "../../components/UserRating";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";

type RatingScreenRouteProp = RouteProp<RootStackParamList, "Rating">;

type Props = {
  route: RatingScreenRouteProp;
};

export default function UserRatingScreen({ route }: Props) {
  const { userName } = route.params;

  return (
    <View>
      <UserRating userName={userName} />
    </View>
  );
}
