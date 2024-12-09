import React from 'react';
import BottomTabNavigator from './BottomTabNavigator'; // Importa el BottomTabNavigator

// Este archivo solo se encarga de la navegación interna, sin envolver con NavigationContainer
const AppNavigator = () => {
  return <BottomTabNavigator />;
};

export default AppNavigator;
