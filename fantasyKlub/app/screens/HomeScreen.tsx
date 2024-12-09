import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import TeamCard from '../components/TeamCard';
import { playersData } from '../data/playersData';
import { Player } from '../types'; // Importa el tipo Player

const HomeScreen: React.FC = () => {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Fantasy Football</Text>
      <FlatList
        data={playersData}
        keyExtractor={(item: Player) => item.id.toString()}
        renderItem={({ item }: { item: Player }) => <TeamCard player={item} />}
      />
    </View>
  );
};

export default HomeScreen;
