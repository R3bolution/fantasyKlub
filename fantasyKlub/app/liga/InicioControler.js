import { createStackNavigator } from '@react-navigation/stack';
import Index from './InicioScreen';
import CrearLiga from './CrearLiga';

const Stack = createStackNavigator();

export default function InicioControler() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="InicioScreen" 
        component={Index} 
      />
      <Stack.Screen 
        name="CrearLiga" // Asegúrate de que el nombre sea correcto
        component={CrearLiga} 
        options={{
          title: 'Crear o unirse a una liga',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}