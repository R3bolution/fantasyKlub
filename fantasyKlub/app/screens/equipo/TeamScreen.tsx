import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'; // Para navegación en la parte superior
import { Text, StyleSheet } from 'react-native';

import AlineacionScreen from './AlineacionScreen';
import PlantillaScreen from './PlantillaScreen';
import PuntosScreen from './PuntosScreen';

const Tab = createMaterialTopTabNavigator(); // Usamos Material Top Tab Navigator para mover la barra a la parte superior

export default function TeamScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: styles.tabBarLabelStyle, // Estilo de las etiquetas de las pestañas
        tabBarActiveTintColor: 'green', // Color del texto cuando está activo
        tabBarInactiveTintColor: 'black', // Color del texto cuando no está activo
        tabBarIndicatorStyle: styles.tabIndicatorStyle, // Subrayado verde debajo de la pestaña activa
        tabBarStyle: styles.tabBarStyle, // Estilo para el contenedor de la barra
      }}
    >
      <Tab.Screen
        name="Alineación"
        component={AlineacionScreen}
        options={{
          tabBarLabel: 'Alineación', // Texto sin íconos
        }}
      />
      <Tab.Screen
        name="Plantilla"
        component={PlantillaScreen}
        options={{
          tabBarLabel: 'Plantilla',
        }}
      />
      <Tab.Screen
        name="Puntos"
        component={PuntosScreen}
        options={{
          tabBarLabel: 'Puntos',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: 'white', // Fondo blanco para la barra de navegación
    elevation: 0, // Para evitar sombras (opcional)
  },
  tabBarLabelStyle: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  tabIndicatorStyle: {
    backgroundColor: 'green', // Subrayado verde cuando la pestaña está activa
    height: 4, // Tamaño del subrayado
  },
});
