import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from '../utils/NavigationUtil';
import SplashScreen from '../pages/SplashScreen';
import HomeScreen from '../pages/HomeScreen';
import SendScreen from '../pages/SendScreen';
import ConnectionScreen from '../pages/ConnectionScreen';
import ReceiveScreen from '../pages/ReceiveScreen';
import ReceivedFileScreen from '../pages/ReceivedFileScreen';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="SendScreen" component={SendScreen} />
        <Stack.Screen name="ConnectionScreen" component={ConnectionScreen} />
        <Stack.Screen name="ReceiveScreen" component={ReceiveScreen} />
        <Stack.Screen
          name="ReceivedFileScreen"
          component={ReceivedFileScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
