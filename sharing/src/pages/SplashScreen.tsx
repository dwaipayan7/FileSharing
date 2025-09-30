import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { navigate } from '../utils/NavigationUtil';
import { Colors, screenWidth } from '../utils/Constants';

const SplashScreen = () => {
  const navigateToHome = () => {
    navigate('HomeScreen');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      navigateToHome();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.img}
        source={require('../../assets/images/logo_text.png')}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  img: {
    width: screenWidth * 0.5,
    height: screenWidth * 0.5,
    resizeMode: 'contain',
  },
});
