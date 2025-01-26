import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { getLigasPorUsuario, contarParticipantes } from "../../database/consultas"; // Importa las funciones

export default function InicioScreen() {
  const [userId, setUserId] = useState(null);
  const [ligas, setLigas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLiga, setSelectedLiga] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const router = useRouter();
  const navigation = useNavigation();

  // Función para obtener el ID de usuario y las ligas
  const fetchUserIdAndLigas = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      if (id) {
        setUserId(id);

        const ligasData = await getLigasPorUsuario(id);

        const ligasConParticipantes = await Promise.all(
          ligasData.map(async (liga) => {
            try {
              const participantes = await contarParticipantes(liga.LigaID);
              const totalParticipantes = participantes.length > 0 ? participantes[0].total : 0;
              return { ...liga, totalParticipantes };
            } catch {
              return { ...liga, totalParticipantes: 0 };
            }
          })
        );

        setLigas(ligasConParticipantes);

        const storedLigaId = await AsyncStorage.getItem("UsuarioLigaID");

        if (storedLigaId) {
          const selected = ligasConParticipantes.find(
            (liga) => liga.UsuarioLigaID.toString() === storedLigaId
          );
          setSelectedLiga(selected);
        } else if (ligasConParticipantes.length > 0) {
          const defaultLiga = ligasConParticipantes[0];
          setSelectedLiga(defaultLiga);
          await AsyncStorage.setItem("UsuarioLigaID", defaultLiga.UsuarioLigaID.toString());
        }
      }
    } catch {
      Alert.alert(
        "Error",
        "No se pudieron cargar las ligas. Por favor, intenta de nuevo más tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserIdAndLigas();
  }, []);

  const refreshLigas = async () => {
    setIsLoading(true);
    await fetchUserIdAndLigas();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("UsuarioLigaID");
      router.replace("/LoginScreen");
    } catch {
      Alert.alert("Error", "No se pudo cerrar sesión. Por favor, intenta de nuevo.");
    }
  };

  const handleSelectLiga = async (liga) => {
    setSelectedLiga(liga);
    try {
      await AsyncStorage.setItem("UsuarioLigaID", liga.UsuarioLigaID.toString());
      await AsyncStorage.setItem("LigaID", liga.LigaID.toString());
      Alert.alert("Liga seleccionada", `Has seleccionado la liga: ${liga.nombre}`);
    } catch {
      Alert.alert("Error", "No se pudo guardar la liga seleccionada. Por favor, intenta de nuevo.");
    }
  };

  const handleNavigateToCrearLiga = () => {
    if (ligas.length >= 5) {
      setAlertMessage("Ya no puedes crear o unirte a más ligas.");
      setIsAlertVisible(true);
    } else {
      navigation.navigate("CrearLiga", { refreshLigas, setSelectedLiga });
    }
  };

  const closeAlert = () => {
    setIsAlertVisible(false);
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inicio</Text>
        <Button title="Crear o Unirse" onPress={handleNavigateToCrearLiga} />
      </View>

      {/* Información de usuario */}
      <View>
        {userId !== null ? (
          <>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              Tu ID es: {userId}
            </Text>
            {selectedLiga && (
              <>
                <Text style={{ fontSize: 18, marginBottom: 20 }}>
                  Estás en la liga con ID: {selectedLiga.LigaID}
                </Text>
                <Text style={{ fontSize: 18, marginBottom: 20 }}>
                  UsuarioLigaID: {selectedLiga.UsuarioLigaID}
                </Text>
              </>
            )}
            {isLoading ? (
              <Text style={{ fontSize: 18 }}>Cargando ligas...</Text>
            ) : (
              <FlatList
                data={ligas}
                keyExtractor={(item) => item.UsuarioLigaID.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelectLiga(item)}>
                    <View
                      style={{
                        padding: 10,
                        marginBottom: 10,
                        borderWidth: 1,
                        borderColor:
                          selectedLiga?.LigaID === item.LigaID ? "#007BFF" : "#ccc",
                        borderRadius: 5,
                        backgroundColor:
                          selectedLiga?.LigaID === item.LigaID ? "#E6F0FF" : "#FFF",
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{item.nombre}</Text>
                      <Text style={{ fontSize: 14 }}>
                        Total de participantes: {item.totalParticipantes}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </>
        ) : (
          <Text style={{ fontSize: 18, marginBottom: 20 }}>Cargando tu ID...</Text>
        )}
      </View>

      {/* Footer */}
      <View style={{ paddingVertical: 20 }}>
        <Button title="Cerrar sesión" onPress={handleLogout} />
      </View>

      {/* Alerta personalizada */}
      {isAlertVisible && (
        <View style={styles.alertContainer}>
          <View style={styles.alertBox}>
            <Text style={styles.alertMessage}>{alertMessage}</Text>
            <Button title="Aceptar" onPress={closeAlert} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
  },
  alertContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertBox: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  alertMessage: {
    fontSize: 18,
    marginBottom: 20,
  },
});
