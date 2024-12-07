import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const TeamSelectionScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Team</Text>
      
      <View style={styles.teamContainer}>
        <Text style={styles.teamText}>Player 1</Text>
        <Button title="Select" onPress={() => console.log('Player 1 selected')} />
      </View>

      <View style={styles.teamContainer}>
        <Text style={styles.teamText}>Player 2</Text>
        <Button title="Select" onPress={() => console.log('Player 2 selected')} />
      </View>

      <View style={styles.teamContainer}>
        <Text style={styles.teamText}>Player 3</Text>
        <Button title="Select" onPress={() => console.log('Player 3 selected')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  teamContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  teamText: {
    fontSize: 18,
    marginBottom: 10,
  }
});

// Exportación predeterminada
export default TeamSelectionScreen;
