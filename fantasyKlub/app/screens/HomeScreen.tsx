import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import TeamCard from '../components/TeamCard';
import { playersData } from '../data/playersData';

// Definir los tipos de datos para el jugador (opcional, si estás usando TypeScript)
type Player = {
  id: number;
  name: string;
  position: string;
  // Otras propiedades de tu jugador
};

const HomeScreen = () => {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Fantasy Football</Text>
      <FlatList
        data={playersData}
        keyExtractor={(item: Player) => item.id.toString()} // Especificar tipo de item si usas TypeScript
        renderItem={({ item }: { item: Player }) => <TeamCard player={item} />}
      />
    </View>
  );
};

export default HomeScreen;
