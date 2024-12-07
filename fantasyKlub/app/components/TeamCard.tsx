// app/components/TeamCard.tsx

import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

interface Player {
  id: number;
  name: string;
  position: string;
  team: string;
  price: number;
  image: string;
}

interface TeamCardProps {
  player: Player;
}

const TeamCard: React.FC<TeamCardProps> = ({ player }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: player.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{player.name}</Text>
        <Text style={styles.position}>Position: {player.position}</Text>
        <Text style={styles.team}>Team: {player.team}</Text>
        <Text style={styles.price}>Price: ${player.price}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  info: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  position: {
    fontSize: 14,
    color: 'gray',
  },
  team: {
    fontSize: 14,
    color: 'gray',
  },
  price: {
    fontSize: 14,
    color: 'green',
  },
});

export default TeamCard;
