import React from 'react';
import { View, Text, StyleSheet, FlatList, ListRenderItem } from 'react-native';

type Jugador = {
  id: string;
  nombre: string;
  detalles: string;
};

const jugadores: Jugador[] = [
  { id: '1', nombre: 'Jugador 1', detalles: 'Detalles del Jugador 1' },
  { id: '2', nombre: 'Jugador 2', detalles: 'Detalles del Jugador 2' },
  { id: '3', nombre: 'Jugador 3', detalles: 'Detalles del Jugador 3' },
];

export default function MercadoScreen() {
  const renderItem: ListRenderItem<Jugador> = ({ item }) => (
    <Text style={styles.listItem}>{item.nombre}: {item.detalles}</Text>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={jugadores}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  listItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginHorizontal: 20,
  },
});
