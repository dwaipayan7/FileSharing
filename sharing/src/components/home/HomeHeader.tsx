import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import {
  Colors,
  screenHeight,
  screenWidth,
  svgPath,
} from '../../utils/Constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../global/Icon';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import QRGenerateModal from '../modal/QRGenerateModal';
import { goBack, navigate } from '../../utils/NavigationUtil';
import { setViewStyle } from 'react-native-reanimated/lib/typescript/css/native';
import QRScannerModal from '../modal/QRScannerModal';

const HomeHeader = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View style={[styles.flexRowBetween, styles.headercontainer]}>
        <TouchableOpacity>
          <Icon iconFamily="Ionicons" name="menu" size={22} color="#fff" />
        </TouchableOpacity>
        <Image
          source={require('../../../assets/images/logo_t.png')}
          style={styles.logo}
        />
        <TouchableOpacity
          onPress={() => {
            setIsVisible(prev => !prev);
            console.log(isVisible);
          }}
        >
          <Image
            source={require('../../../assets/images/profile.jpg')}
            style={styles.profile}
          />
        </TouchableOpacity>
      </View>
      <Svg
        height={screenHeight * 0.17}
        width={screenWidth}
        viewBox="0 0 1440 220"
        style={styles.headerCurve}
      >
        <Defs>
          <LinearGradient id="grad" x1={'0'} x2={'0'} y1={'0'} y2={'1'}>
            <Stop offset={'0%'} stopColor={'#007aff'} stopOpacity={'1'} />
            <Stop offset={'100%'} stopColor={'#80bfff'} stopOpacity={'1'} />
          </LinearGradient>
        </Defs>
        <Path fill={'#80bfff'} d={svgPath} />
        <Path fill="url(#grad)" d={svgPath} />
      </Svg>

      {isVisible && (
        <QRGenerateModal
          visible={isVisible}
          onClose={() => setIsVisible(false)}
        />
      )}
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
  },
  flexRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headercontainer: {
    padding: 10,
    zIndex: 4,
  },
  logo: {
    width: screenWidth * 0.4,
    height: screenHeight * 0.048,
    resizeMode: 'contain',
  },
  profile: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  curve: {
    position: 'absolute',
    bottom: -screenHeight * 0.09,
    zIndex: 3,
    width: '100%',
  },

  headerCurve: {
    position: 'absolute',
    bottom: -screenHeight * 0.09,
    zIndex: 3,
    width: '100%',
  },
});
