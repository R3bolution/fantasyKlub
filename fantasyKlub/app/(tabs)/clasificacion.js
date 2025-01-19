import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const API_BASE_URL = "http://192.168.1.27:3000/api";

const Clasificacion = () => {
  const [clasificaciones, setClasificaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuarioLigaID, setUsuarioLigaID] = useState(null);

  const obtenerUsuarioLigaID = useCallback(async () => {
    try {
      const id = await AsyncStorage.getItem("UsuarioLigaID");
      console.log('UsuarioLigaID obtenido desde AsyncStorage:', id);
      if (id) {
        setUsuarioLigaID(id);
      } else {
        setError("No se encontró el UsuarioLigaID.");
      }
    } catch (error) {
      console.error("Error al obtener el UsuarioLigaID:", error);
      setError("Error al obtener el UsuarioLigaID.");
    }
  }, []);

  const fetchClasificacionGeneral = useCallback(async () => {
    if (!usuarioLigaID) {
      console.log("No se ha encontrado UsuarioLigaID, cancelando la actualización.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Realizando las solicitudes en paralelo
      console.log("Solicitando usuarios y jornadas...");
      const [usuariosResponse, jornadasResponse] = await Promise.all([
        axios.post(`${API_BASE_URL}/liga/obtenerUsuarios`, { LigaID: 1 }),
        axios.post(`${API_BASE_URL}/jornada/obtenerJornadas`),
      ]);

      const usuarios = usuariosResponse.data;
      const jornadas = jornadasResponse.data;

      if (!usuarios.length || !jornadas.length) {
        throw new Error("No se encontraron usuarios o jornadas.");
      }

      const clasificacionesAcumuladas = await Promise.all(
        usuarios.map(async (usuario) => {
          let totalPuntos = 0;

          // Iterando sobre las jornadas
          for (const jornada of jornadas) {
            try {
              const jugadores = usuario.jugadores || [];

              // Solo procesamos la jornada si el usuario tiene al menos 3 jugadores
              if (jugadores.length >= 3) {
                if (!jornada.JornadaID) {
                  console.log(`JornadaID no definida para el Usuario ${usuario.UsuarioLigaID}`);
                  continue; // Saltamos a la siguiente jornada
                }

                // Realizando la solicitud para obtener la puntuación
                console.log(`Solicitando puntuación para Usuario ${usuario.UsuarioLigaID}, Jornada ${jornada.JornadaID}`);
                const puntuacionResponse = await axios.post(
                  `${API_BASE_URL}/liga/obtenerPuntuacion`,
                  {
                    jornadaID: jornada.JornadaID,
                    UsuarioLigaID: usuario.UsuarioLigaID,
                    jornada: jornada.JornadaID, // Usamos JornadaID también aquí
                  }
                );

                // Comprobamos la respuesta
                console.log(`Puntuación recibida para Usuario ${usuario.UsuarioLigaID}, Jornada ${jornada.JornadaID}:`, puntuacionResponse.data);

                const puntuaciones = puntuacionResponse.data;

                // Muestra el número de puntuaciones obtenidas
                console.log(`Número de puntuaciones recibidas para Usuario ${usuario.UsuarioLigaID}, Jornada ${jornada.JornadaID}: ${puntuaciones.length}`);

                // Solo sumamos los puntos si obtenemos las 3 puntuaciones necesarias
                if (puntuaciones.length >= 3) {
                  const puntosDeLaJornada = puntuaciones.reduce((acc, item) => acc + (item.puntos || 0), 0);
                  totalPuntos += puntosDeLaJornada;
                  console.log(`Usuario ${usuario.UsuarioLigaID} sumó ${puntosDeLaJornada} puntos en la jornada ${jornada.JornadaID}`);
                } else {
                  console.log(`Usuario ${usuario.UsuarioLigaID} no tiene suficientes jugadores para puntuar en la jornada ${jornada.JornadaID}`);
                }
              } else {
                console.log(`Usuario ${usuario.UsuarioLigaID} no tiene suficientes jugadores en la jornada ${jornada.JornadaID}`);
              }
            } catch (error) {
              console.log(`Error al procesar la Jornada ${jornada.JornadaID} para el Usuario ${usuario.UsuarioLigaID}:`, error);
            }
          }

          return {
            usuarioLigaID: usuario.UsuarioLigaID,
            nombre: usuario.nombre || "Sin nombre",
            puntos: totalPuntos,
          };
        })
      );

      clasificacionesAcumuladas.sort((a, b) => b.puntos - a.puntos);
      setClasificaciones(clasificacionesAcumuladas);
    } catch (error) {
      console.error("Error al calcular la clasificación general:", error);
      setError("No se pudo calcular la clasificación general: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [usuarioLigaID]);

  useFocusEffect(
    useCallback(() => {
      obtenerUsuarioLigaID();
    }, [obtenerUsuarioLigaID])
  );

  useFocusEffect(
    useCallback(() => {
      if (usuarioLigaID) {
        console.log('Recargando clasificación...');
        fetchClasificacionGeneral();
      }
    }, [usuarioLigaID, fetchClasificacionGeneral])
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        UsuarioLigaID seleccionado: {usuarioLigaID || "No seleccionado"}
      </Text>
      <Text style={styles.title}>Clasificación General</Text>
      {clasificaciones.length > 0 ? (
        <FlatList
          data={clasificaciones}
          keyExtractor={(item) => item.usuarioLigaID.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={styles.position}>{index + 1}</Text>
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.points}>{item.puntos}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No hay datos para mostrar.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  position: {
    width: 30,
    fontSize: 16,
    fontWeight: 'bold',
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
  points: {
    width: 50,
    fontSize: 16,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 10,
    color: '#888',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Clasificacion;
