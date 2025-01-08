import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Index() {
  const [userId, setUserId] = useState(null); // Estado para almacenar la ID del usuario
  const router = useRouter();

  // Recuperar la ID del usuario al montar el componente
  useEffect(() => {
    const fetchUserId = async () => {
      
      try {
        const id = await AsyncStorage.getItem('userId'); // Recuperar la ID desde AsyncStorage
        if (id) {
          setUserId(id); // Guardar la ID en el estado
        }
      } catch (error) {
        console.error('Error al obtener la ID del usuario:', error);
      }
    };

    fetchUserId();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token'); // Elimina el token de AsyncStorage
      await AsyncStorage.removeItem('userId'); // Opcional: Eliminar la ID del usuario también
      router.replace('/LoginScreen'); // Redirige al usuario a la pantalla de login
    } catch (error) {
      console.error('Error al intentar cerrar sesión', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Inicio</Text>
      {userId !== null ? (
        <Text style={{ fontSize: 18, marginBottom: 20 }}>Tu ID es: {userId}</Text>
      ) : (
        <Text style={{ fontSize: 18, marginBottom: 20 }}>Cargando tu ID...</Text>
      )}
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}
