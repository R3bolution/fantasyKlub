// app/screens/HomeScreen.tsx

import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import TeamCard from '../components/TeamCard';
import { playersData } from '../data/playersData';

const HomeScreen = () => {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Fantasy Football</Text>
      <FlatList
        data={playersData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TeamCard player={item} />}
      />
    </View>
  );
};

export default HomeScreen;
