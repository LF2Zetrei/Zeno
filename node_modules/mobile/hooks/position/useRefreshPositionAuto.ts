// hooks/useTrackingAutomatique.ts
import { useEffect } from "react";
import { useActualiserPositionTracking } from "./useRTefreshPosition";

const INTERVALLE = 60 * 60 * 1000; // 1h

export function useTrackingAutomatique(missionIds: string[]) {
  const { actualiserPosition } = useActualiserPositionTracking();

  useEffect(() => {
    // Démarrage immédiat
    missionIds.forEach((id) => actualiserPosition(id));

    const interval = setInterval(() => {
      missionIds.forEach((id) => actualiserPosition(id));
    }, INTERVALLE);

    return () => clearInterval(interval);
  }, [missionIds]);
}
