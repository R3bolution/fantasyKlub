import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';

// Función para obtener las jornadas desde el backend
const obtenerJornadas = async () => {
  try {
    const response = await axios.post('http://192.168.1.27:3000/api/jornada/obtenerJornadas', {}, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las jornadas:', error);
    return [];
  }
};

// Función para obtener los jugadores por jornada
const obtenerJugadoresPorJornada = async (usuarioLigaID, jornada, JornadaID) => {
  try {
    const response = await axios.post('http://192.168.1.27:3000/api/equipo/jugadorPorJornada', {
      usuarioLigaID,
      jornada,
      JornadaID,
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los jugadores:', error);
    return { jugadores: [] };
  }
};

// Función para obtener los jugadores alineados
const obtenerJugadoresAlineados = async (usuarioID, ligaID) => {
  try {
    const response = await axios.post('http://192.168.1.27:3000/api/equipo/alineacion', {
      UsuarioLigaID: 2,
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los jugadores alineados:', error);
    return [];
  }
};

export default function PuntosScreen() {
  const [jornadas, setJornadas] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [selectedJornada, setSelectedJornada] = useState(null);
  const [usuarioID] = useState(1);
  const [ligaID] = useState(1);

  useEffect(() => {
    const fetchJornadas = async () => {
      const data = await obtenerJornadas();
      setJornadas(data);
      if (data.length > 0) {
        setSelectedJornada(data[data.length - 1].jornada);
      }
    };

    fetchJornadas();
  }, []);

  useEffect(() => {
    const fetchJugadores = async () => {
      if (selectedJornada !== null) {
        const data = await obtenerJugadoresPorJornada(1, selectedJornada, selectedJornada);

        if (data.jugadores.length === 0) {
          // Si no hay jugadores para la jornada, obtenemos los alineados
          const jugadoresAlineados = await obtenerJugadoresAlineados(1, 1);

          // Completar con jugadores "Sin alinear" si no hay suficiente cantidad
          const jugadoresFinal = jugadoresAlineados.length >= 3 
            ? jugadoresAlineados.slice(0, 3) // Limitar a 3 jugadores
            : [
                ...jugadoresAlineados, 
                ...new Array(3 - jugadoresAlineados.length).fill({ Nombre: 'Sin alinear', puntos: '-' })
              ];

          setJugadores(jugadoresFinal.map(jugador => ({
            Nombre: jugador.nombre || 'Sin alinear',  // Si no tiene nombre, lo asignamos como 'Sin alinear'
            puntos: jugador.puntos || '-'
          })));
        } else {
          setJugadores(data.jugadores.map(jugador => ({
            ...jugador,
            Nombre: jugador.Nombre || 'Sin alinear',
            puntos: jugador.puntos || '-',
          })));
        }
      }
    };

    fetchJugadores();
  }, [selectedJornada]);

  // Función para determinar el fondo del bloque de puntuación de acuerdo a los puntos
  const getPuntosBackgroundColor = (puntos) => {
    if (puntos === '-') return '#888';  // Gris para sin puntos
    if (puntos > 0) return '#4CAF50';  // Verde para puntos positivos
    if (puntos < 0) return '#F44336';  // Rojo para puntos negativos
    return '#FFEB3B';  // Amarillo para 0 puntos
  };

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.jornadasContainer}
        >
          {jornadas.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.jornada}
              onPress={() => setSelectedJornada(item.jornada)}
            >
              <Text style={styles.jornadaText}>J{item.jornada}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {jugadores.length > 0 ? (
          jugadores.map((jugador, index) => (
            <View key={index} style={[styles.player, styles[`player${index + 1}`]]}>
              <Text style={styles.playerText}>{jugador.Nombre}</Text>
              
              {/* Bloque de puntuación con fondo dinámico */}
              <View
                style={[
                  styles.pointsContainer,
                  { backgroundColor: getPuntosBackgroundColor(jugador.puntos) },
                ]}
              >
                <Text style={styles.pointsText}>{jugador.puntos}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noPlayersContainer}>
            <Text>No hay jugadores disponibles para esta jornada.</Text>
          </View>
        )}
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
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
    top: '15%',
    left: '50%',
    transform: [{ translateX: -40 }],
  },
  player2: {
    bottom: '25%',
    left: '20%',
    transform: [{ translateX: -40 }],
  },
  player3: {
    bottom: '25%',
    right: '20%',
    transform: [{ translateX: 40 }],
  },
  playerText: {
    color: '#fff',
  },
  pointsContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 30,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  pointsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sinAlinearText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 10,
  },
  noPlayersContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  }
});
