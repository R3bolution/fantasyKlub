import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!validateEmail(email)) {
      setError('El correo electrónico no tiene un formato válido');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.27:3000/api/user/registerUser', {
        nombre: username,
        correo: email,
        contraseña: password,
      });

      if (response.status === 201) {
        setSuccessMessage('Registro exitoso. Ahora puedes iniciar sesión.');
        router.replace('/LoginScreen');
      } else {
        setError(response.data.message || 'Hubo un error al registrar al usuario');
      }
    } catch (err) {
      setError('Ocurrió un error al intentar registrar al usuario');
      console.error(err);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      {successMessage ? <Text style={{ color: 'green' }}>{successMessage}</Text> : null}
      <Button title="Registrar" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;
