import { useUpdateUserPosition } from "../user/useUserPosition";
import { demanderLocalisation } from "../../utils/localisation";

export function useActualiserUserPosition() {
  const { updatePosition, loading, error, user } = useUpdateUserPosition();

  const actualiserPosition = async () => {
    const position = await demanderLocalisation();

    if (!position) {
      console.warn("Position non disponible");
      return;
    }

    const { latitude, longitude } = position;
    await updatePosition(latitude, longitude);
  };

  return {
    actualiserPosition,
    loading,
    error,
    user,
  };
}
