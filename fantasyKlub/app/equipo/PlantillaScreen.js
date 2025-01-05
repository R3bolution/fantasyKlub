import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';  // Importa axios

const App = () => {
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const consultaJugadores = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://192.168.1.27:3000/api/jugadores/plantilla', {  // Asegúrate de usar la IP correcta
        tipoConsulta: 'jugadores',
        params: {
          UsuarioID: 1,
          LigaID: 1,
        },
      });

      console.log('Datos recibidos:', response.data);
      setJugadores(response.data);  // Asumiendo que la respuesta es un array de jugadores
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
