import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function AlineacionScreen() {
  const [jugadores, setJugadores] = useState([]);
  const [usuarioLigaID, setUsuarioLigaID] = useState(null);
  const navigation = useNavigation(); // Hook para navegación

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserIdAndJugadorData = async () => {
        try {
          const ligaId = await AsyncStorage.getItem("UsuarioLigaID");

          if (ligaId) {
            setUsuarioLigaID(ligaId);  // Se actualiza el estado con el UsuarioLigaID

            const response = await axios.post('http://192.168.1.27:3000/api/equipo/alineacion', {
              UsuarioLigaID: parseInt(ligaId),
            });

            setJugadores(response.data);
          } else {
            Alert.alert('Error', 'No se encontró información de liga. Por favor, vuelve a seleccionar una liga.');
          }
        } catch (error) {
          if (error.response) {
            Alert.alert('Error', `Error del servidor: ${error.response.data.message || 'Algo salió mal'}`);
          } else if (error.request) {
            Alert.alert('Error', 'No se pudo conectar con el servidor. Verifica tu conexión a internet.');
          } else {
            Alert.alert('Error', 'Ocurrió un error inesperado. Intenta de nuevo más tarde.');
          }
        }
      };

      fetchUserIdAndJugadorData();
    }, [])  // El useEffect se ejecutará solo cuando el componente se enfoque
  );

  const jugadoresAlineados = [...jugadores];
  while (jugadoresAlineados.length < 3) {
    jugadoresAlineados.push({ jugadorID: null, nombre: 'Sin alinear', alineado: false });
  }

  const handlePlayerPress = async (jugador) => {
    try {
      // Guardamos el JugadorID en AsyncStorage
      await AsyncStorage.setItem('selectedJugadorID', jugador.jugadorID.toString());

      // Aquí pasamos toda la información del jugador, incluyendo el JugadorID
      navigation.navigate('CambioJugadorScreen', { jugador });
    } catch (error) {
      console.log('Error', 'No se pudo guardar el jugador seleccionado.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        UsuarioLigaID seleccionado: {usuarioLigaID || 'Cargando...'}
      </Text>

      <View style={styles.field}>
        {jugadoresAlineados.map((jugador, index) => (
          <TouchableOpacity
            key={jugador.jugadorID || index}
            style={[styles.player, styles[`player${index + 1}`]]}
            onPress={() => handlePlayerPress(jugador)} // Al presionar, pasamos el jugador completo
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
