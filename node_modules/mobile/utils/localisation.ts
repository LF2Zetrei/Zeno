// utils/localisation.ts

import * as Location from "expo-location";

export const demanderLocalisation = async () => {
  try {
    // Demander la permission
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permission de localisation refusée");
      return null;
    }

    // Récupérer la position
    let location = await Location.getCurrentPositionAsync({});
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    return { latitude, longitude };
  } catch (error) {
    console.error("Erreur lors de la récupération de la localisation :", error);
    return null;
  }
};
