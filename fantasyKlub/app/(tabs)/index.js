import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";

export default function Index() {
  const [userId, setUserId] = useState(null);
  const [ligas, setLigas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLiga, setSelectedLiga] = useState(null);
  const [allData, setAllData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserIdAndLigas = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (id) {
          setUserId(id);

          const response = await axios.post(
            "http://192.168.1.27:3000/api/liga/ligasUsuarios",
            {
              UsuarioID: id,
            }
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
              } catch (error) {
                console.error(
                  `Error al obtener el número de participantes para la liga ${liga.LigaID}:`,
                  error
                );
                return { ...liga, totalParticipantes: 0 };
              }
            })
          );

          setLigas(ligasConParticipantes);

          // Verificar si ya existe una liga seleccionada en AsyncStorage
          const storedLigaId = await AsyncStorage.getItem("UsuarioLigaID");

          if (storedLigaId) {
            // Si ya existe una liga seleccionada, establecerla como seleccionada
            const selected = ligasConParticipantes.find(
              (liga) => liga.UsuarioLigaID.toString() === storedLigaId
            );
            setSelectedLiga(selected);
          } else if (ligasConParticipantes.length > 0) {
            // Si no hay liga seleccionada, seleccionar la primera liga disponible
            const defaultLiga = ligasConParticipantes[0];
            setSelectedLiga(defaultLiga);

            // Guardar el UsuarioLigaID de la liga por defecto en AsyncStorage
            await AsyncStorage.setItem("UsuarioLigaID", defaultLiga.UsuarioLigaID.toString());
          }

          setAllData(response.data);
        }
      } catch (error) {
        console.error("Error al obtener las ligas del usuario:", error);
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
      router.replace("/LoginScreen");
    } catch (error) {
      console.error("Error al intentar cerrar sesión", error);
    }
  };

  const handleSelectLiga = async (liga) => {
    setSelectedLiga(liga);
    try {
      // Guardar el UsuarioLigaID de la liga seleccionada en AsyncStorage
      await AsyncStorage.setItem("UsuarioLigaID", liga.UsuarioLigaID.toString());
    } catch (error) {
      console.error("Error al guardar UsuarioLigaID en AsyncStorage:", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
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
                UsuarioLigaEs: {selectedLiga.UsuarioLigaID}
              </Text>
            </>
          )}
          {isLoading ? (
            <Text style={{ fontSize: 18 }}>Cargando datos...</Text>
          ) : (
            <>
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
                          selectedLiga?.LigaID === item.LigaID
                            ? "#007BFF"
                            : "#ccc",
                        borderRadius: 5,
                        backgroundColor:
                          selectedLiga?.LigaID === item.LigaID
                            ? "#E6F0FF"
                            : "#FFF",
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
              <View style={{ marginTop: 20 }}>
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
                >
                  Datos completos para depuración:
                </Text>
                <ScrollView>
                  {allData.map((data, index) => (
                    <View
                      key={index}
                      style={{
                        padding: 10,
                        marginBottom: 10,
                        borderWidth: 1,
                        borderColor: "#aaa",
                        borderRadius: 5,
                      }}
                    >
                      <Text style={{ fontSize: 14 }}>
                        {JSON.stringify(data, null, 2)}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </>
          )}
        </>
      ) : (
        <Text style={{ fontSize: 18, marginBottom: 20 }}>
          Cargando tu ID...
        </Text>
      )}
      <Button
        title="Cerrar sesión"
        onPress={handleLogout}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}
