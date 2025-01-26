import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { obtenerJugadoresAlineados } from "../../../database/consultas";

export default function AlineacionScreen() {
  const [jugadores, setJugadores] = useState([]);
  const [usuarioLigaID, setUsuarioLigaID] = useState(null);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchAlineacionData = async () => {
        try {
          const ligaId = await AsyncStorage.getItem("UsuarioLigaID");

          if (ligaId) {
            setUsuarioLigaID(ligaId);

            // Llamada al módulo de Axios
            const data = await obtenerJugadoresAlineados(ligaId);
            setJugadores(data);
          } else {
            Alert.alert(
              "Error",
              "No se encontró información de liga. Por favor, selecciona una liga nuevamente."
            );
          }
        } catch (error) {
          Alert.alert("Error", error.message || "Ocurrió un error inesperado.");
        }
      };

      fetchAlineacionData();
    }, [])
  );

  const jugadoresAlineados = [...jugadores];
  while (jugadoresAlineados.length < 3) {
    jugadoresAlineados.push({
      jugadorID: null,
      nombre: "Sin alinear",
      alineado: false,
    });
  }

  const handlePlayerPress = async (jugador) => {
    try {
      await AsyncStorage.setItem(
        "selectedJugadorID",
        jugador.jugadorID?.toString() || ""
      );
      navigation.navigate("CambioJugadorScreen", { jugador });
    } catch (error) {
      console.log("Error al guardar el jugador seleccionado:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        UsuarioLigaID seleccionado: {usuarioLigaID || "Cargando..."}
      </Text>

      <View style={styles.field}>
        {jugadoresAlineados.map((jugador, index) => (
          <TouchableOpacity
            key={jugador.jugadorID || index}
            style={[styles.player, styles[`player${index + 1}`]]}
            onPress={() => handlePlayerPress(jugador)}
          >
            <Text style={styles.playerText}>{jugador.nombre}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    position: "relative",
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
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
    transform: [{ translateX: -25 }],
  },
  player2: {
    bottom: "25%",
    left: "20%",
    transform: [{ translateX: -25 }],
  },
  player3: {
    bottom: "25%",
    right: "20%",
    transform: [{ translateX: 25 }],
  },
  playerText: {
    color: "#fff",
  },
});
