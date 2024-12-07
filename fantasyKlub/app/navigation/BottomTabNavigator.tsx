// app/navigation/AppNavigator.tsx o App.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Importa tus pantallas
import HomeScreen from '../screens/HomeScreen';
import ClassificationScreen from '../screens/ClassificationScreen';
import TeamScreen from '../screens/TeamScreen';
import MarketScreen from '../screens/MarketScreen';
import ActivityScreen from '../screens/ActivityScreen';

// Crear el BottomTabNavigator
const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            tabBarLabel: 'Inicio',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Classification" 
          component={ClassificationScreen} 
          options={{
            tabBarLabel: 'Clasificación',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="list" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Team" 
          component={TeamScreen} 
          options={{
            tabBarLabel: 'Equipo',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="users" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Market" 
          component={MarketScreen} 
          options={{
            tabBarLabel: 'Mercado',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="shopping-cart" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Activity" 
          component={ActivityScreen} 
          options={{
            tabBarLabel: 'Actividad',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="bell" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
