import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colors } from '../utils/Constants';
import HomeHeader from '../components/home/HomeHeader';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <HomeHeader />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100, padding: 15 }}
        showsVerticalScrollIndicator={false}
      >
        <SendReceiveButton />
        <Options isHome />
        <Misc />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
