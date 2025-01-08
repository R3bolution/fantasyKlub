import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';  // Importa axios
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage

const App = () => {
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Recupera el UserId de AsyncStorage y consulta los jugadores
  const consultaJugadores = async () => {
    setLoading(true);
    setError(null);

    try {
      // Obtener el userId desde AsyncStorage
      const id = await AsyncStorage.getItem('userId');
      if (id) {
        setUserId(id);
        console.log("UserID recuperado:", id);
      } else {
        console.error("No se encontró el UserID en AsyncStorage.");
      }

      // Realizar la solicitud para obtener los jugadores
      const response = await axios.post('http://192.168.1.27:3000/api/equipo/plantilla', {
        tipoConsulta: 'jugadores',
        params: {
          UsuarioID: id || 1, // Usa el UserID recuperado o un valor por defecto
          LigaID: 1,
        },
      });

      console.log('Datos recibidos:', response.data);
      setJugadores(response.data);  // Guardar los jugadores en el estado
    } catch (err) {
      console.error('Error al hacer la solicitud:', err);
      setError(err.message || 'Error al obtener los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    consultaJugadores();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Nombre: {item.nombre}</Text>
      <Text style={styles.itemText}>Deporte: {item.deporte}</Text>
      <Text style={styles.itemText}>Posición: {item.posicion}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : (
        <View style={styles.listContainer}>
          <Text style={styles.header}>Jugadores:</Text>
          <FlatList
            data={jugadores}
            renderItem={renderItem}
            keyExtractor={(item) => item.JugadorID ? item.JugadorID.toString() : item.id.toString()}
          />
        </View>
      )}
      <Button title="Consultar Jugadores" onPress={consultaJugadores} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  listContainer: {
    width: '90%',
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
  button: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
