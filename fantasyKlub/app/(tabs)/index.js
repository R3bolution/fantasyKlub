import React from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');  // Elimina el token de AsyncStorage
      router.replace('/LoginScreen');  // Redirige al usuario a la pantalla de login
    } catch (error) {
      console.error('Error al intentar cerrar sesión', error);
    }
  };

  return (
    <View>
      <Text>Inicio</Text>
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}
