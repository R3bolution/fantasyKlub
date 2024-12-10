import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'; // Para navegación en la parte superior
import { Text, StyleSheet } from 'react-native';

import MercadoScreen from './MercadoScreen';
import OpcionesCreen from './OpcionesScreen';
import HistoricoScreen from './HistoricoScreen';

const Tab = createMaterialTopTabNavigator();

export default function TeamScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: styles.tabBarLabelStyle, 
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'black',
        tabBarIndicatorStyle: styles.tabIndicatorStyle,
        tabBarStyle: styles.tabBarStyle,
      }}
    >
      <Tab.Screen
        name="Alineación"
        component={MercadoScreen}
        options={{
          tabBarLabel: 'Mercado',
        }}
      />
      <Tab.Screen
        name="Plantilla"
        component={OpcionesCreen}
        options={{
          tabBarLabel: 'Mis Ops.',
        }}
      />
      <Tab.Screen
        name="Puntos"
        component={HistoricoScreen}
        options={{
          tabBarLabel: 'Historico',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: 'white', 
    elevation: 0, 
  },
  tabBarLabelStyle: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  tabIndicatorStyle: {
    backgroundColor: 'green', 
    height: 4,
  },
});
