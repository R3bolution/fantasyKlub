import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet } from 'react-native';

import { AlineacionScreen, PlantillaScreen, PuntosScreen } from './index'; // Importación limpia

const Tab = createMaterialTopTabNavigator();

export default function EquipoLayout() {
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
      <Tab.Screen name="Alineación" component={AlineacionScreen} />
      <Tab.Screen name="Plantilla" component={PlantillaScreen} />
      <Tab.Screen name="Puntos" component={PuntosScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: { backgroundColor: 'white', elevation: 0 },
  tabBarLabelStyle: { fontSize: 16, fontWeight: 'normal' },
  tabIndicatorStyle: { backgroundColor: 'green', height: 4 },
});
