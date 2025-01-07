import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import axios from 'axios';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.1.27:3000/api/user/loginUser', {
        correo: username,
        contraseña: password,
      });

      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        router.replace('/(tabs)');
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      setError('Ocurrió un error al intentar iniciar sesión');
      console.error(err);
    }
  };

  const goToRegister = () => {
    router.push('/RegisterScreen');
  };

  return (
    <View>
      <TextInput
        placeholder="Correo"
        value={username}
        onChangeText={setUsername}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <Button title="Iniciar sesión" onPress={handleLogin} />
      <Button title="¿No tienes cuenta? Regístrate" onPress={goToRegister} />
    </View>
  );
};

export default LoginScreen;
