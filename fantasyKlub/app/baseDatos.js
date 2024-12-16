import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default function baseDatos() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://192.168.1.27:3000/users/pedro'); // Cambia la IP a la correcta
        console.log('Respuesta:', response.data); // Verifica los datos que recibes
        setUser(response.data); // Actualiza el estado
      } catch (err) {
        console.error('Error al obtener el usuario:', err); // Muestra errores si los hay
        setError('Error al obtener el usuario');
      }
    };
  
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Usuario encontrado:</Text>
          <Text>ID: {user.id}</Text>
          <Text>Username: {user.username}</Text>
          <Text>Email: {user.email}</Text>
        </>
      ) : error ? (
        <Text>{error}</Text> // Mostrar mensaje de error si hay un problema
      ) : (
        <Text>Cargando...</Text> // Muestra mensaje de carga mientras no haya respuesta
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
