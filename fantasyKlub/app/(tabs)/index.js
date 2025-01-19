import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";

export default function Index() {
  const [userId, setUserId] = useState(null);
  const [ligas, setLigas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLiga, setSelectedLiga] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserIdAndLigas = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (id) {
          setUserId(id);

          const response = await axios.post(
            "http://192.168.1.27:3000/api/liga/ligasUsuarios",
            { UsuarioID: id }
          );

          const ligasConParticipantes = await Promise.all(
            response.data.map(async (liga) => {
              try {
                const participantesResponse = await axios.post(
                  "http://192.168.1.27:3000/api/liga/contarParticipantes",
                  { LigaID: liga.LigaID }
                );

                const totalParticipantes =
                  participantesResponse.data.length > 0
                    ? participantesResponse.data[0].total
                    : 0;

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

    fetchUserIdAndLigas();
  }, []);

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
  

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 40 }}>
      {/* Header */}
      <View>
        <Text style={{ fontSize: 24, marginBottom: 20, textAlign: "center" }}>
          Inicio
        </Text>
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
            {isLoading && <Text style={{ fontSize: 18 }}>Cargando datos...</Text>}
          </>
        ) : (
          <Text style={{ fontSize: 18, marginBottom: 20 }}>Cargando tu ID...</Text>
        )}
      </View>

      {/* Lista de ligas */}
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
        ListFooterComponent={() => (
          <View style={{ paddingVertical: 20 }}>
            <Button title="Cerrar sesión" onPress={handleLogout} style={{ marginTop: 20 }} />
          </View>
        )}
      />
    </View>
  );
}
