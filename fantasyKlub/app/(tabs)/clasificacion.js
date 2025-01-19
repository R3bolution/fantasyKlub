import { View } from "react-native";
import ClasificacionControler from "../clasificacion/ClasificacionControler"; // Importación por defecto

export default function clasificacion() {
  return (
    <View style={{ flex: 1 }}>
      <ClasificacionControler />
    </View>
  );
}