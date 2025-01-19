import { createStackNavigator } from '@react-navigation/stack';
import ClasificacionScreen from './ClasificacionScreen';
import VerPlantillaScreen from './VerPlantillaScreen';

const Stack = createStackNavigator();

export default function ClasificacionControler() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="ClasificacionScreen" 
        component={ClasificacionScreen} 
      />
      <Stack.Screen 
        name="VerPlantillaScreen" // Asegúrate de que el nombre sea correcto
        component={VerPlantillaScreen} 
        options={{
          title: 'Ver Plantilla',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}
