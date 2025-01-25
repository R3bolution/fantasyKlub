import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';

export default function ClasificacionScreen() {
  const [usuarioLigaID, setUsuarioLigaID] = useState(null);
  const [ligaID, setLigaID] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [jornadas, setJornadas] = useState([]);
  const [puntuaciones, setPuntuaciones] = useState({});
  const navigation = useNavigation(); // Crear instancia de navegación

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const storedUsuarioLigaID = await AsyncStorage.getItem("UsuarioLigaID");
          const storedLigaID = await AsyncStorage.getItem("LigaID");

          if (storedUsuarioLigaID && storedLigaID) {
            setUsuarioLigaID(storedUsuarioLigaID);
            setLigaID(storedLigaID);

            const usuariosResponse = await axios.post(
              "http://192.168.1.27:3000/api/liga/obtenerUsuarios",
              { LigaID: parseInt(storedLigaID) }
            );
            setUsuarios(usuariosResponse.data);

            const jornadasResponse = await axios.post(
              "http://192.168.1.27:3000/api/jornada/obtenerJornadas"
            );
            setJornadas(jornadasResponse.data);

            const puntuacionesMap = {};
            for (const usuario of usuariosResponse.data) {
              puntuacionesMap[usuario.UsuarioLigaID] = {};
              for (const jornada of jornadasResponse.data) {
                const response = await axios.post(
                  "http://192.168.1.27:3000/api/liga/obtenerPuntuacion",
                  {
                    UsuarioLigaID: usuario.UsuarioLigaID,
                    jornadaID: jornada.JornadaID,
                    jornada: jornada.Jornada,
                  }
                );

                if (response.data.length === 3) {
                  puntuacionesMap[usuario.UsuarioLigaID][jornada.Jornada] = response.data;
                } else {
                  puntuacionesMap[usuario.UsuarioLigaID][jornada.Jornada] = [];
                }
              }
            }

            setPuntuaciones(puntuacionesMap);
          } else {
            Alert.alert(
              "Información faltante",
              "No se encontró información de la liga seleccionada. Por favor, selecciona una liga desde la pantalla principal."
            );
          }
        } catch (error) {
          console.error("Error al cargar datos:", error);
          Alert.alert(
            "Error",
            error.response?.data?.message || "No se pudieron cargar los datos."
          );
        }
      };

      fetchData();
    }, [])
  );

  const calcularTotalPuntos = (usuarioLigaID) => {
    const usuarioPuntuaciones = puntuaciones[usuarioLigaID];
    let totalPuntos = 0;
    for (const jornada in usuarioPuntuaciones) {
      const puntuacionesDeJornada = usuarioPuntuaciones[jornada];
      if (puntuacionesDeJornada && puntuacionesDeJornada.length === 3) {
        totalPuntos += puntuacionesDeJornada.reduce((total, jugador) => total + jugador.puntos, 0);
      }
    }
    return totalPuntos;
  };

  const usuariosOrdenados = usuarios.sort((a, b) => {
    const puntosA = calcularTotalPuntos(a.UsuarioLigaID);
    const puntosB = calcularTotalPuntos(b.UsuarioLigaID);
    return puntosB - puntosA;
  });

  const handleUserPress = async (item) => {
    if (item.UsuarioLigaID == usuarioLigaID) {
      // Si el UsuarioLigaID coincide con el del usuario actual, redirigir a la pantalla "EquipoScreen"
      navigation.navigate("equipo");
    } else {
      // Si es otro usuario, guardar el UsuarioLigaID en AsyncStorage
      try {
        await AsyncStorage.setItem('verJugador', item.UsuarioLigaID.toString());
        await AsyncStorage.setItem('verNombre', item.nombre.toString());
        navigation.navigate("VerPlantillaScreen"); // Navegar a la pantalla VerPlantillaScreen
      } catch (error) {
        console.error("Error al guardar el UsuarioLigaID en AsyncStorage:", error);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Clasificación</Text>

      {usuarioLigaID && ligaID ? (
        <>
          <Text style={styles.text}>UsuarioLigaID: {usuarioLigaID}</Text>
          <Text style={styles.text}>LigaID: {ligaID}</Text>
        </>
      ) : (
        <Text style={styles.text}>Cargando datos...</Text>
      )}

      <FlatList
        data={usuariosOrdenados}
        keyExtractor={(item) => item.UsuarioLigaID.toString()}
        renderItem={({ item, index }) => {
          const totalPuntos = calcularTotalPuntos(item.UsuarioLigaID);

          // Usar un 'if' para verificar si es el usuario actual y aplicar los estilos correspondientes
          let userItemStyle = styles.userItem;
          let userNameStyle = styles.userName;
          if (item.UsuarioLigaID == usuarioLigaID) {
            userItemStyle = styles.userItemCurrent;  // Estilo para el usuario actual
            userNameStyle = styles.userNameCurrent;  // Estilo para el nombre del usuario actual
          }

          return (
            <TouchableOpacity
              onPress={() => handleUserPress(item)}
              style={userItemStyle}  // Aplica el estilo adecuado
            >
              <Text style={userNameStyle}>
                {index + 1}. {item.nombre} - {totalPuntos}
              </Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.text}>No hay usuarios en esta liga.</Text>
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#007BFF",
  },
  text: {
    fontSize: 18,
    marginTop: 10,
    color: "#333",
    textAlign: "center",
  },
  userItem: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  userItemCurrent: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    backgroundColor: "#007BFF",
  },
  userNameCurrent: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000", 
  },
});
