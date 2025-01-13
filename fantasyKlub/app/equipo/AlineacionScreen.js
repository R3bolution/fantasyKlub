import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function AlineacionScreen() {
  const [jugadores, setJugadores] = useState([]);
  const [userId, setUserId] = useState(null);
  const [usuarioLigaID, setUsuarioLigaID] = useState(null);

  // Usamos useFocusEffect para recargar los datos cada vez que la pantalla recibe el enfoque
  useFocusEffect(
    React.useCallback(() => {
      const fetchUserIdAndJugadorData = async () => {
        try {
          // Recuperar userId y UsuarioLigaID desde AsyncStorage
          const id = await AsyncStorage.getItem("userId");
          const ligaId = await AsyncStorage.getItem("UsuarioLigaID");

          console.log("userId:", id); // Log para verificar el userId
          console.log("UsuarioLigaID:", ligaId); // Log para verificar el UsuarioLigaID

          if (id && ligaId) {
            setUserId(id);
            setUsuarioLigaID(ligaId);  // Establece el UsuarioLigaID

            // Solicitar los jugadores para esa liga
            console.log("Realizando solicitud con UsuarioLigaID:", ligaId); // Log de la solicitud

            const response = await axios.post('http://192.168.1.27:3000/api/equipo/alineacion', {
              UsuarioLigaID: ligaId, // Usamos el ligaId recuperado del AsyncStorage
            });

            console.log("Respuesta de la API:", response.data); // Log para verificar la respuesta

            setJugadores(response.data);
          } else {
            console.error("No se encontraron valores en AsyncStorage.");
          }
        } catch (error) {
          console.error("Error al obtener la información:", error.message);
          // Mostrar mensaje amigable al usuario
          Alert.alert('Error', 'Hubo un problema al obtener los jugadores. Intenta de nuevo más tarde.');
        }
      };

      fetchUserIdAndJugadorData();
    }, [usuarioLigaID])  // Este efecto se ejecuta cada vez que usuarioLigaID cambie
  );

  const jugadoresAlineados = [...jugadores];
  while (jugadoresAlineados.length < 3) {
    jugadoresAlineados.push({ id: null, nombre: 'Sin alinear', alineado: false });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        {/* Mostrar el UsuarioLigaID en la pantalla */}
        UsuarioLigaID seleccionado: {usuarioLigaID}
      </Text>

      <View style={styles.field}>
        {jugadoresAlineados.map((jugador, index) => (
          <View
            key={jugador.id || index}
            style={[styles.player, styles[`player${index + 1}`]]}
          >
            <Text style={styles.playerText}>{jugador.nombre}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  field: {
    flex: 1,
    backgroundColor: '#4CAF50',
    margin: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  player: {
    backgroundColor: '#293133',
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius: 2,
    width: 80,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  player1: {
    top: '15%',
    left: '50%',
    transform: [{ translateX: -25 }],
  },
  player2: {
    bottom: '25%',
    left: '20%',
    transform: [{ translateX: -25 }],
  },
  player3: {
    bottom: '25%',
    right: '20%',
    transform: [{ translateX: 25 }],
  },
  playerText: {
    color: '#fff',
  },
});
