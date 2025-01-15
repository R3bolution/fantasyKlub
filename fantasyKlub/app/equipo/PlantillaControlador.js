import { createStackNavigator } from '@react-navigation/stack';
import PlantillaScreen from './plantilla/PlantillaScreen';
import InfoJugador from './plantilla/InfoJugador';

const Stack = createStackNavigator();

export default function PlantillaControler() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PlantillaScreen" 
        component={PlantillaScreen} 
        options={{ headerShown: false }} // No mostrar cabecera en PlantillaScreen
      />
      <Stack.Screen 
        name="InfoJugador" 
        component={InfoJugador} 
        options={{
          title: 'Información del Jugador', // Título de la pantalla
          headerShown: true, // Mostrar la cabecera
          headerBackTitle: 'Atrás', // Título del botón de retroceso
        }}
      />
    </Stack.Navigator>
  );
}
