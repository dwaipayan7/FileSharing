import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomText from '../global/CustomText';

const Misc = () => {
  return (
    <View style={styles.container}>
      <CustomText fontSize={13} fontFamily="Okra-Bold">
        Explore
      </CustomText>
      <Image
        source={require('../../../assets/icons/wild_robot.jpg')}
        style={styles.image}
      />
      <View style={styles.flexRowBetween}>
        <CustomText fontFamily="Okra-Bold" style={styles.text} fontSize={20}>
          #1 Best File Sharing
        </CustomText>
        <Image
          source={require('../../../assets/icons/share_logo.jpg')}
          style={{ height: 120, resizeMode: 'contain', width: '35%' }}
        />
      </View>

      <CustomText fontFamily="Okra-Bold" style={styles.text2}>
        Made with ❤️ - Dwaipayan Biswas
      </CustomText>
    </View>
  );
};

export default Misc;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  adBanner: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginVertical: 25,
  },
  text: {
    opacity: 0.5,
    width: '60%',
  },
  text2: {
    opacity: 0.5,
    marginTop: 10,
  },
  image: {
    resizeMode: 'cover',
    height: 120,
    width: '100%',
    marginTop: 15,
    borderRadius: 12,
  },
  flexRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
