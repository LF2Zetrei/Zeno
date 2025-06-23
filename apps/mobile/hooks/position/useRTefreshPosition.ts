import { useTrackingPositions } from "../tracking/useTrackingPositions";
import { demanderLocalisation } from "../../utils/localisation";

export function useActualiserPositionTracking() {
  const { updateTracking, loading, error, tracking } = useTrackingPositions();

  const actualiserPosition = async (missionId: string) => {
    const position = await demanderLocalisation();

    if (!position) {
      console.warn("Position non disponible");
      return;
    }

    const { latitude, longitude } = position;
    await updateTracking(missionId, latitude, longitude);
  };

  return {
    actualiserPosition,
    loading,
    error,
    tracking,
  };
}
