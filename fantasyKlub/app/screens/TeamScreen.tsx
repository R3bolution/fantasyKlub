import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { playersData } from '../data/playersData'; // Asegúrate de que playersData está disponible
import TeamCard from '../components/TeamCard'; // Importa el componente TeamCard
import { Player } from '../types'; // Asegúrate de importar el tipo Player

const TeamScreen: React.FC = () => {
  // Renderizar cada jugador en un TeamCard
  const renderItem = ({ item }: { item: Player }) => {
    return <TeamCard player={item} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={playersData}  // Lista de jugadores
        renderItem={renderItem}  // Cómo renderizar cada ítem
        keyExtractor={(item) => item.id.toString()}  // Asegúrate de tener un identificador único
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default TeamScreen;
