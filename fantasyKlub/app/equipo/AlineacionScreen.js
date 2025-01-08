import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AlineacionScreen() {
  const [jugadores, setJugadores] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserIdAndJugadores = async () => {
      try {
        // Recuperar el userId desde AsyncStorage
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id);  // Guardar el userId en el estado
          console.log("ID del usuario:", id);  // Verificar que se obtiene la ID
        }

        // Ahora que tenemos el userId, hacer la solicitud para los jugadores
        const response = await axios.post('http://192.168.1.27:3000/api/equipo/alineacion', {
          UsuarioID: id || 1, // Usamos el userId recuperado, o un valor por defecto si no está disponible
          LigaID: 1
        });
        setJugadores(response.data);  // Guardar los jugadores en el estado
      } catch (error) {
        console.error('Error al obtener los jugadores:', error);
      }
    };

    fetchUserIdAndJugadores();
  }, []);

  const jugadoresAlineados = [...jugadores];

  while (jugadoresAlineados.length < 3) {
    jugadoresAlineados.push({ id: null, nombre: 'Sin alinear', alineado: false });
  }

  return (
    <View style={styles.container}>
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
