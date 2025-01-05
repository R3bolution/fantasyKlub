import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';  // Importamos axios

// Función para obtener las jornadas desde el backend usando axios
const obtenerJornadas = async () => {
  try {
    const response = await axios.post('http://192.168.1.27:3000/api/jornada/obtenerJornadas', {}, {  // Pasamos un objeto vacío si no necesitamos enviar datos
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Retornamos los datos de las jornadas obtenidas
    return response.data;
  } catch (error) {
    console.error('Error al obtener las jornadas:', error);
    return [];  // En caso de error, devolvemos un array vacío
  }
};

export default function PuntosScreen() {
  const [jornadas, setJornadas] = useState([]);

  useEffect(() => {
    const fetchJornadas = async () => {
      const data = await obtenerJornadas();
      setJornadas(data);  // Actualizamos el estado con las jornadas obtenidas
    };

    fetchJornadas();  // Llamamos a la función para obtener las jornadas
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false} // Para ocultar la barra de desplazamiento
          contentContainerStyle={styles.jornadasContainer}
        >
          {jornadas.map((item, index) => (
            <View key={index} style={[styles.jornada]}>
              <Text style={styles.jornadaText}>J{item.jornada}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={[styles.player, styles.player1]}>
          <Text style={[styles.playerText]}>Jugador 1</Text>
          <Text style={styles.points}>10</Text>
        </View>
        <View style={[styles.player, styles.player2]}>
          <Text style={[styles.playerText]}>Jugador 2</Text>
          <Text style={styles.points}>8</Text>
        </View>
        <View style={[styles.player, styles.player3]}>
          <Text style={[styles.playerText]}>Jugador 3</Text>
          <Text style={styles.points}>7</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
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
  jornadasContainer: {
    flexDirection: 'row',  // Aseguramos que las jornadas se alineen horizontalmente
    justifyContent: 'flex-start', // Alineación de las jornadas
    marginBottom: 20, // Espacio entre las jornadas y los jugadores
  },
  jornada: {
    backgroundColor: '#293133',
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius: 5,
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  jornadaText: {
    color: '#fff',
    fontSize: 12,
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
    top: '15%',
    left: '50%',
    transform: [{ translateX: -25 }],
  },
  player2: {
    position: 'absolute',
    bottom: '25%',
    left: '20%',
    transform: [{ translateX: -25 }],
  },
  player3: {
    position: 'absolute',
    bottom: '25%',
    right: '20%',
    transform: [{ translateX: 25 }],
  },
  points: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#00FF80',
    padding: 5,
    fontSize: 10,
  },
  playerText: {
    color: '#fff',
  },
});
