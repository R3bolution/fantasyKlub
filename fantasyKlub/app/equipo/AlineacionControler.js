import { createStackNavigator } from '@react-navigation/stack';
import AlineacionScreen from './alineacion/AlineacionScreen';
import CambioJugadorScreen from './alineacion/CambioJugadorScreen';

const Stack = createStackNavigator();

export default function AlineacionControler() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="AlineacionScreen" 
        component={AlineacionScreen} 
      />
      <Stack.Screen 
        name="CambioJugadorScreen" 
        component={CambioJugadorScreen} 
        options={{
          title: 'Cambiar Jugador', // Título de la pantalla
          headerShown: true, // Mostrar la cabecera
          headerBackTitle: 'Atrás', // Título del botón de retroceso
        }}
      />
    </Stack.Navigator>
  );
}