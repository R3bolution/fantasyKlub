import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InfoJugadorScreen = () => {
  const [jugador, setJugador] = useState(null); // Datos del jugador
  const [loading, setLoading] = useState(false); // Cargando
  const [error, setError] = useState(null); // Error
  const [userLigaID, setUserLigaID] = useState(null); // UsuarioLigaID
  const [jugadorID, setJugadorID] = useState(null); // JugadorID

  const obtenerJugador = async () => {
    setLoading(true);
    setError(null);

    try {
      // Recuperar UsuarioLigaID y JugadorID de AsyncStorage
      const storedUsuarioLigaID = await AsyncStorage.getItem('UsuarioLigaID');
      const storedJugadorID = await AsyncStorage.getItem('JugadorSeleccionadoID');

      if (!storedUsuarioLigaID || !storedJugadorID) {
        throw new Error('No se pudo recuperar UsuarioLigaID o JugadorID.');
      }

      setUserLigaID(storedUsuarioLigaID);
      setJugadorID(storedJugadorID);

      // Hacer la solicitud al servidor
      const response = await axios.post('http://192.168.1.27:3000/api/equipo/obtenerJugador', {
        UsuarioLigaID: storedUsuarioLigaID,
        JugadorID: storedJugadorID,
      });

      console.log('Datos del jugador:', response.data);

      // Validar los datos recibidos
      if (response.data && response.data.Nombre) {
        setJugador(response.data);
      } else {
        throw new Error('Datos del jugador no válidos.');
      }
    } catch (err) {
      console.error('Error al obtener el jugador:', err);
      setError(err.message || 'Error al obtener los datos del jugador');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerJugador();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>UsuarioLigaID seleccionado: {userLigaID}</Text>
      <Text style={styles.infoText}>Jugador seleccionado: {jugadorID}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : jugador ? (
        <View style={styles.infoContainer}>
          <Text style={styles.header}>Información del Jugador</Text>
          <Text style={styles.infoText}>Nombre: {jugador.Nombre}</Text>
          <Text style={styles.infoText}>Deporte: {jugador.Deporte}</Text>
          <Text style={styles.infoText}>Posición: {jugador.Posicion}</Text>
          <Text style={styles.infoText}>Estado: {jugador.Estado}</Text>
          {jugador.PosicionAlineacion && (
            <Text style={styles.infoText}>
              Posición en Alineación: {jugador.PosicionAlineacion}
            </Text>
          )}
        </View>
      ) : (
        <Text style={styles.noDataText}>No se encontró información del jugador.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '90%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 18,
    color: '#555',
    fontStyle: 'italic',
  },
});

export default InfoJugadorScreen;
