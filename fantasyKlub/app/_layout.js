// layout.js (tu archivo de layout principal)
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Verificar si el usuario está logueado al cargar el layout
  useEffect(() => {
    const checkSession = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
        router.replace('/(tabs)');  // Redirige a los tabs si está logueado
      } else {
        setIsLoggedIn(false);
        router.replace('/LoginScreen'); // Redirige al login si no está autenticado
      }
    };

    checkSession(); // Llamamos a la función de verificación
  }, [router]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

