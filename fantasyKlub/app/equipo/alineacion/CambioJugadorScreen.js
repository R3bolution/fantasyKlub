import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function CambioJugadorScreen({ route, navigation }) {
  const { jugador } = route.params; // El jugador actual
  const [reservados, setReservados] = useState([]);
  const [usuarioLigaID, setUsuarioLigaID] = useState(null);
  const [selectedJugador, setSelectedJugador] = useState(null); // Estado para el jugador seleccionado
  const [storedJugadorID, setStoredJugadorID] = useState(null); // Estado para almacenar el jugador actual ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtén el UsuarioLigaID desde AsyncStorage
        const storedUsuarioLigaID = await AsyncStorage.getItem('UsuarioLigaID');
        const storedJugadorID = await AsyncStorage.getItem('selectedJugadorID'); // Obtener el JugadorID de AsyncStorage

        if (!storedUsuarioLigaID || !storedJugadorID) {
          Alert.alert('Error', 'No se pudo obtener los datos requeridos.');
          return;
        }

        setUsuarioLigaID(storedUsuarioLigaID);
        setStoredJugadorID(storedJugadorID); // Guardar JugadorID

        // Llama al endpoint para obtener el jugador actual, ahora enviando tanto UsuarioLigaID como JugadorID
        const currentPlayerResponse = await axios.post('http://192.168.1.27:3000/api/equipo/obtenerJugador', {
          UsuarioLigaID: storedUsuarioLigaID,  // Enviamos el UsuarioLigaID
          JugadorID: storedJugadorID,  // Enviamos el JugadorID del jugador seleccionado
        });

        // Asignamos los datos directamente ya que ahora es un objeto
        setSelectedJugador(currentPlayerResponse.data); // El jugador actual se almacena

        // Llama al endpoint para obtener los jugadores reservados
        const response = await axios.post('http://192.168.1.27:3000/api/equipo/obtenerReservados', {
          UsuarioLigaID: storedUsuarioLigaID,
        });
        setReservados(response.data);
      } catch (error) {
        Alert.alert(
          'Error',
          error.response?.data?.message || 'No se pudieron obtener los jugadores reservados.'
        );
      }
    };

    fetchData();
  }, []);

  const handleChangeJugador = async (jugadorReservado) => {
    console.log('Se ha clicado en un jugador reservado: ', jugadorReservado); // Confirmar que estamos clicando el jugador

    try {
      // Verificamos que el JugadorID actual esté presente
      if (!storedJugadorID) {
        Alert.alert('Error', 'No se encontró el ID del jugador actual.');
        return;
      }

      // Llama al endpoint para cambiar los jugadores
      const response = await axios.post('http://192.168.1.27:3000/api/equipo/cambiarJugador', {
        UsuarioLigaID: usuarioLigaID,
        JugadorID1: jugadorReservado.JugadorID,
        JugadorID2: storedJugadorID,
      });

      // Confirmación del cambio
      if (response.data.message) {
        console.log('Éxito', 'El cambio de jugador se realizó correctamente.');
        // Actualizamos AsyncStorage con el nuevo jugador
        await AsyncStorage.setItem('selectedJugadorID', jugadorReservado.JugadorID.toString());
        navigation.goBack(); // Regresar a la pantalla anterior
      }
    } catch (error) {
      console.log(
        'Error',
        error.response?.data?.message || 'No se pudo realizar el cambio de jugador.'
      );
    }
  };

  const handleGoToAlineacion = () => {
    // Redirigir a la página de plantilla sin hacer ningún cambio
    navigation.navigate('AlineacionScreen'); // Asegúrate de tener registrada la pantalla 'PlantillaScreen'
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cambiar Jugador</Text>
      
      {/* Jugador actual como botón */}
      <TouchableOpacity
        style={[
          styles.playerInfoContainer,
          selectedJugador && styles.selectedPlayerText, // Resaltar si está seleccionado
        ]}
        onPress={handleGoToAlineacion}
      >
        <Text style={styles.playerInfo}>
          Jugador actual: {selectedJugador ? selectedJugador.Nombre : 'Cargando...'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Selecciona un jugador reservado para cambiar:</Text>

      {reservados.length > 0 ? (
        <FlatList
          data={reservados}
          keyExtractor={(item) => item.JugadorID.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.reservedPlayer,
                selectedJugador?.JugadorID === item.JugadorID && styles.selectedPlayer, // Resaltar el jugador seleccionado
              ]}
              onPress={() => {
                console.log('Jugador seleccionado:', item); // Confirmar que el jugador seleccionado es el correcto
                handleChangeJugador(item); // Cambia el jugador automáticamente al seleccionar
              }}
            >
              <Text style={styles.playerText}>{item.Nombre}</Text>
              <Text style={styles.playerText}>Deporte: {item.Deporte}</Text>
              <Text style={styles.playerText}>Posición: {item.Posicion}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noPlayers}>No hay jugadores reservados disponibles.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  playerInfoContainer: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedPlayerText: {
    backgroundColor: '#FF9800', // Color para el texto cuando está "seleccionado"
  },
  playerInfo: {
    color: '#fff',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#777',
  },
  reservedPlayer: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedPlayer: {
    backgroundColor: '#FF9800', // Color para el jugador seleccionado
  },
  playerText: {
    color: '#fff',
    fontSize: 16,
  },
  noPlayers: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#999',
  },
});
