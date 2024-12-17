import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const jugadores = [
  { id: '1', nombre: 'Jugador 1' },
  { id: '2', nombre: 'Jugador 2' },
  { id: '3', nombre: 'Jugador 3' },
];

export default function AlineacionScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <View style={[styles.player, styles.player1]}>
          <Text style={styles.playerText}>Jugador 1</Text>
        </View>
        <View style={[styles.player, styles.player2]}>
          <Text style={styles.playerText}>Jugador 2</Text>
        </View>
        <View style={[styles.player, styles.player3]}>
          <Text style={styles.playerText}>Jugador 3</Text>
        </View>
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
    position: 'absolute',
    top: '15%',  // Ajustado a un 15% para que esté más cerca de la parte superior
    left: '50%', // Centrado horizontalmente
    transform: [{ translateX: -25 }], // Corrige el centrado horizontal exacto
  },
  player2: {
    position: 'absolute',
    bottom: '25%', // Colocado en la parte inferior
    left: '20%',   // Desplazado hacia la izquierda
    transform: [{ translateX: -25 }], // Centrado horizontalmente
  },
  player3: {
    position: 'absolute',
    bottom: '25%', // Colocado en la parte inferior
    right: '20%',  // Desplazado hacia la derecha
    transform: [{ translateX: 25 }], // Centrado horizontalmente
  },
  listItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginHorizontal: 20,
  },
  playerText: {
    color: '#fff',
  },
});
