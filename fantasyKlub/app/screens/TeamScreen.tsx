import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Player } from '../types'; // Asegúrate de importar el tipo

interface TeamCardProps {
  player: Player; // Define la prop esperada
}

const TeamCard: React.FC<TeamCardProps> = ({ player }) => {
  if (!player) {
    return <Text>No player data available</Text>;
  }

  return (
    <View style={styles.card}>
      <Text>{player.name}</Text>
      <Text>{player.position}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
});

export default TeamCard;
