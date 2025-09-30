import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../utils/Constants';
import HomeHeader from '../components/home/HomeHeader';
import SendReceiveButton from '../components/home/SendReceiveButton';
import Options from '../components/home/Options';
import Misc from '../components/home/Misc';
import Icon from '../components/global/Icon';
import QRScannerModal from '../components/modal/QRScannerModal';

const HomeScreen = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

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
      <View style={styles.floatingQRContainer}>
        <TouchableOpacity>
          <Icon iconFamily="Ionicons" name="apps-sharp" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsVisible(true)}>
          <Image
            source={require('../../assets/images/qr-code-scan.png')}
            style={{
              height: 65,
              width: 65,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon iconFamily="Ionicons" name="cog" size={24} />
        </TouchableOpacity>
      </View>

      {isVisible && (
        <QRScannerModal
          visible={isVisible}
          onClose={() => setIsVisible(false)}
        />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  floatingQRContainer: {
    position: 'absolute',
    width: '90%',
    height: 60,
    backgroundColor: '#f3f3f3',
    bottom: 20,
    alignSelf: 'center',
    borderRadius: 23,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
