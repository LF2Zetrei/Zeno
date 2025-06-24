import { useEffect } from "react";
import { useActualiserUserPosition } from "./useRefreshUserPosition";

const INTERVALLE = 5 * 60 * 1000; // 5min

export function useTrackingUserAutomatique() {
  const { actualiserPosition } = useActualiserUserPosition();

  useEffect(() => {
    // Démarrage immédiat
    actualiserPosition();

    // Rafraîchissement périodique
    const interval = setInterval(() => {
      actualiserPosition();
    }, INTERVALLE);

    return () => clearInterval(interval);
  }, []);
}
