// app/navigation/BottomTabNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../screens/HomeScreen';
import ClassificationScreen from '../screens/ClassificationScreen'; 
import TeamScreen from '../screens/TeamScreen'; 
import MarketScreen from '../screens/MarketScreen';
import ActivityScreen from '../screens/ActivityScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#ccc',
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Clasificación"
        component={ClassificationScreen}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="trophy" size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Equipo"
        component={TeamScreen}  // Asegúrate de que aquí esté el componente correcto
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="users" size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Mercado"
        component={MarketScreen}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="shopping-cart" size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Actividad"
        component={ActivityScreen}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="bell" size={20} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
