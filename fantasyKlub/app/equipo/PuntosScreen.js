import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const obtenerJornadas = async () => {
  try {
    const response = await axios.post(
      "http://192.168.1.27:3000/api/jornada/obtenerJornadas",
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.map((jornada) => ({
      ...jornada,
      iniciado: jornada.Iniciado,
    }));
  } catch (error) {
    console.error("Error al obtener las jornadas:", error);
    return [];
  }
};

const obtenerJugadoresPorJornada = async (
  usuarioLigaID,
  jornada,
  JornadaID
) => {
  try {
    const response = await axios.post(
      "http://192.168.1.27:3000/api/equipo/jugadorPorJornada",
      {
        usuarioLigaID,
        jornada,
        JornadaID,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener los jugadores:", error);
    return { jugadores: [] };
  }
};

const obtenerJugadoresAlineados = async (usuarioLigaID) => {
  try {
    const response = await axios.post(
      "http://192.168.1.27:3000/api/equipo/alineacion",
      {
        UsuarioLigaID: usuarioLigaID,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener los jugadores alineados:", error);
    return [];
  }
};

export default function PuntosScreen() {
  const [jornadas, setJornadas] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [selectedJornada, setSelectedJornada] = useState(null);
  const [usuarioLigaID, setUsuarioLigaID] = useState(null);
  const [iniciado, setIniciado] = useState(null);

  useEffect(() => {
    const obtenerUsuarioLigaID = async () => {
      try {
        const id = await AsyncStorage.getItem("UsuarioLigaID");
        setUsuarioLigaID(id);
      } catch (error) {
        console.error("Error al obtener el UsuarioLigaID:", error);
      }
    };

    const interval = setInterval(obtenerUsuarioLigaID, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchJornadas = async () => {
      const data = await obtenerJornadas();
      setJornadas(data);
      if (data.length > 0) {
        setSelectedJornada(data[data.length - 1].Jornada);
        setIniciado(data[data.length - 1].iniciado);
      }
    };

    fetchJornadas();
  }, []);

  useEffect(() => {
    const fetchJugadores = async () => {
      if (selectedJornada !== null && usuarioLigaID !== null) {
        let jugadoresData = [];

        if (iniciado === 0) {
          jugadoresData = await obtenerJugadoresAlineados(usuarioLigaID);
        } else {
          const data = await obtenerJugadoresPorJornada(
            usuarioLigaID,
            selectedJornada,
            selectedJornada
          );
          jugadoresData = data.jugadores;
        }

        const jugadoresFinal = [
          ...jugadoresData,
          ...new Array(3 - jugadoresData.length).fill({
            nombre: "Sin alinear",
            puntos: "-",
          }),
        ].slice(0, 3);

        setJugadores(
          jugadoresFinal.map((jugador) => ({
            Nombre: jugador.nombre || "Sin alinear",
            puntos: jugador.puntos || "-",
          }))
        );
      }
    };

    fetchJugadores();
  }, [selectedJornada, usuarioLigaID, iniciado]);

  const getPuntosBackgroundColor = (puntos) => {
    if (puntos === "-") return "#888";
    if (puntos > 0) return "#4CAF50";
    if (puntos < 0) return "#F44336";
    return "#FFEB3B";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        UsuarioLigaID seleccionado: {usuarioLigaID || "Sin ID disponible"}
      </Text>
      <View style={styles.field}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.jornadasContainer}
        >
          {jornadas.length > 0 ? (
            jornadas.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.jornada,
                  item.Jornada === selectedJornada && styles.selectedJornada, // Estilo para la jornada seleccionada
                ]}
                onPress={() => {
                  setSelectedJornada(item.Jornada);
                  setIniciado(item.iniciado);
                }}
              >
                <Text style={styles.jornadaText}>J{item.Jornada}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noJornadasText}>
              No hay jornadas disponibles
            </Text>
          )}
        </ScrollView>

        {jugadores.map((jugador, index) => (
          <View
            key={index}
            style={[styles.player, styles[`player${index + 1}`]]}
          >
            <Text style={styles.playerText}>{jugador.Nombre}</Text>
            <View
              style={[
                styles.pointsContainer,
                { backgroundColor: getPuntosBackgroundColor(jugador.puntos) },
              ]}
            >
              <Text style={styles.pointsText}>{jugador.puntos}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  field: {
    flex: 1,
    backgroundColor: "#4CAF50",
    margin: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  jornadasContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  jornada: {
    backgroundColor: "#293133",
    borderColor: "#ddd",
    borderWidth: 2,
    borderRadius: 5,
    width: 80,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  jornadaText: {
    color: "#fff",
    fontSize: 12,
  },
  selectedJornada: {
    backgroundColor: "#795144", 
    borderColor: "#FFEF3F", 
  },
  noJornadasText: {
    color: "#888",
    fontSize: 16,
  },
  player: {
    backgroundColor: "#293133",
    borderColor: "#ddd",
    borderWidth: 2,
    borderRadius: 2,
    width: 80,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  player1: {
    top: "15%",
    left: "50%",
    transform: [{ translateX: -40 }],
  },
  player2: {
    bottom: "25%",
    left: "20%",
    transform: [{ translateX: -40 }],
  },
  player3: {
    bottom: "25%",
    right: "20%",
    transform: [{ translateX: 40 }],
  },
  playerText: {
    color: "#fff",
  },
  pointsContainer: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 30,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  pointsText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  sinAlinearText: {
    color: "#ff0000",
    fontSize: 12,
    marginTop: 10,
  },
  noPlayersContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
