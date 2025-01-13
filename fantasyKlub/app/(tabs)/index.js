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
  const [userId, setUserId] = useState(null); // Estado para almacenar la ID del usuario
  const [ligas, setLigas] = useState([]); // Estado para almacenar las ligas
  const [isLoading, setIsLoading] = useState(true); // Estado para mostrar indicador de carga
  const [selectedLiga, setSelectedLiga] = useState(null); // Estado para la liga seleccionada
  const [allData, setAllData] = useState([]); // Estado para almacenar todos los datos de la API
  const router = useRouter();

  useEffect(() => {
    const fetchUserIdAndLigas = async () => {
      try {
        const id = await AsyncStorage.getItem("userId"); // Recuperar la ID desde AsyncStorage
        if (id) {
          setUserId(id); // Guardar la ID en el estado

          // Llamada a la API para obtener las ligas
          const response = await axios.post(
            "http://192.168.1.27:3000/api/liga/ligasUsuarios",
            {
              UsuarioID: id,
            }
          );

          // Añadir total de participantes a cada liga
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

          setLigas(ligasConParticipantes); // Guardar las ligas con participantes en el estado

          // Seleccionar por defecto la primera liga
          if (ligasConParticipantes.length > 0) {
            setSelectedLiga(ligasConParticipantes[0]); // Selecciona la primera liga
          }

          setAllData(response.data); // Guardar todos los datos en el estado adicional
        }
      } catch (error) {
        console.error("Error al obtener las ligas del usuario:", error);
      } finally {
        setIsLoading(false); // Ocultar indicador de carga
      }
    };

    fetchUserIdAndLigas();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token"); // Elimina el token de AsyncStorage
      await AsyncStorage.removeItem("userId"); // Opcional: Eliminar la ID del usuario también
      router.replace("/LoginScreen"); // Redirige al usuario a la pantalla de login
    } catch (error) {
      console.error("Error al intentar cerrar sesión", error);
    }
  };

  const handleSelectLiga = (liga) => {
    setSelectedLiga(liga); // Establecer la liga seleccionada
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
              {/* Tabla adicional para mostrar todos los datos de la API */}
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
