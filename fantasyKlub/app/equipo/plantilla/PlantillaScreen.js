import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const PlantillaScreen = () => {
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usuarioLigaID, setUsuarioLigaID] = useState(null);

  const navigation = useNavigation();

  const consultaJugadores = async () => {
    setLoading(true);
    setError(null);

    try {
      const ligaId = await AsyncStorage.getItem("UsuarioLigaID");
      setUsuarioLigaID(ligaId);

      const response = await axios.post('http://192.168.1.27:3000/api/equipo/plantilla', {
        UsuarioLigaID: ligaId,
      });

      setJugadores(response.data);
    } catch (err) {
      console.error('Error al hacer la solicitud:', err);
      setError(err.message || 'Error al obtener los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const syncLigaID = async () => {
      const storedLigaId = await AsyncStorage.getItem("UsuarioLigaID");
      setUsuarioLigaID(storedLigaId);
    };

    const interval = setInterval(syncLigaID, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (usuarioLigaID) {
      consultaJugadores();
    }
  }, [usuarioLigaID]);

  const seleccionarJugador = async (jugadorID) => {
    try {
      await AsyncStorage.setItem('JugadorSeleccionadoID', jugadorID.toString());
      navigation.navigate('InfoJugador');
    } catch (err) {
      console.error('Error al guardar el ID del jugador:', err);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => seleccionarJugador(item.JugadorID)} style={styles.itemContainer}>
      <Text style={styles.itemText}>Nombre: {item.nombre}</Text>
      <Text style={styles.itemText}>Deporte: {item.deporte}</Text>
      <Text style={styles.itemText}>Posición: {item.posicion}</Text>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View>
      <Text style={styles.infoText}>
        UsuarioLigaID seleccionado: {usuarioLigaID}
      </Text>
      <Text style={styles.header}>Jugadores:</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : jugadores.length === 0 ? (
        <Text style={styles.noPlayersText}>No tienes jugadores en tu equipo.</Text>
      ) : (
        <FlatList
          data={jugadores}
          renderItem={renderItem}
          keyExtractor={(item) =>
            item.JugadorID ? item.JugadorID.toString() : item.id.toString()
          }
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  noPlayersText: {
    fontSize: 18,
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
});

export default PlantillaScreen;
