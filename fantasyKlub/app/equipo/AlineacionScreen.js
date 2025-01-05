import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default function AlineacionScreen() {
  const [jugadores, setJugadores] = useState([]);

  useEffect(() => {
    const fetchJugadores = async () => {
      try {
        const response = await axios.post('http://192.168.1.27:3000/api/equipo/alineacion', {
            UsuarioID: 1,
            LigaID: 1
        });        
        setJugadores(response.data);
      } catch (error) {
        console.error('Error al obtener los jugadores:', error);
      }
    };
    
    fetchJugadores();
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
