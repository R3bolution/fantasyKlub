import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Asegúrate de que "player" esté siendo usado como props en este componente
const TeamCard = ({ player }) => {
    console.log(player);  // Verifica qué datos tiene "player"
  
    if (!player) {
      return <Text>No player data available</Text>;  // Si no hay datos, muestra un mensaje
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