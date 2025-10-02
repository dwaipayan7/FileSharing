import {
  Image,
  Platform,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/global/Icon';
import CustomText from '../components/global/CustomText';
import BreakerText from '../components/ui/BreakerText';
import { Colors, screenWidth } from '../utils/Constants';
import LottieView from 'lottie-react-native';
import DeviceInfo from 'react-native-device-info';
import QRGenerateModal from '../components/modal/QRGenerateModal';
import { goBack, navigate } from '../utils/NavigationUtil';
import { useTCP } from '../service/TCPProvider';
import {
  getBroadcastIPAddress,
  getLocalIPAddress,
} from '../utils/networkUtils';
import dgram from 'react-native-udp';
import { errorCodes } from '@react-native-documents/picker';

const ReceiveScreen = () => {
  const { startServer, server, isConnected } = useTCP();
  const [qrValue, setQRValue] = useState('');
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const setupServer = async () => {
    const deviceName = await DeviceInfo.getDeviceName();
    const ip = await getLocalIPAddress();
    const port = 4000;

    if (!server) {
      startServer(port);
    }

    setQRValue(`tcp://${ip}:${port}|${deviceName}`);
    console.log(`Server info: ${ip}:${port}`);
  };

  const sendDiscoverySignal = async () => {
    const deviceName = await DeviceInfo.getDeviceName();
    const broadcastAddress = await getBroadcastIPAddress();
    const targetAddress = broadcastAddress || '255.255.255.255';
    const port = 57143;

    const client = dgram.createSocket({
      type: 'udp4',
      reusePort: true,
    });

    client.bind(() => {
      try {
        if (Platform.OS === 'ios') {
          client.setBroadcast(true);
        }
        client.send(
          `${qrValue}`,
          0,
          `${qrValue}`.length,
          port,
          targetAddress,
          err => {
            if (err) {
              console.log('Error sending discovery signal ', err);
            } else {
              console.log(
                `${deviceName} Discovery Signal sent to ${targetAddress}`,
              );
            }
            client.close();
          },
        );
      } catch (error) {
        console.log('Failed to set broadcast or send: ', error);
        client.close();
      }
    });
  };

  useEffect(() => {
    if (!qrValue) {
      return;
    }

    sendDiscoverySignal();
    intervalRef.current = setInterval(sendDiscoverySignal, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [qrValue]);

  const handleGoBack = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    goBack();
  };

  useEffect(() => {
    setupServer();
  }, []);

  useEffect(() => {
    if (isConnected) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      navigate('ConnectionScreen');
    }
  }, [isConnected]);

  return (
    <LinearGradient
      colors={['#ffffff', '#4da0de', '#3387c5']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      {/* <SafeAreaView /> */}

      <View style={styles.mainContainer}>
        <View style={styles.infoContainer}>
          <Icon
            name="blur-on"
            iconFamily="MaterialIcons"
            color="#fff"
            size={40}
          />
          <CustomText
            fontFamily="Okra-Bold"
            color="#fff"
            fontSize={16}
            style={{ marginTop: 20 }}
          >
            Receiving from nearby device
          </CustomText>
          <CustomText
            fontFamily="Okra-Medium"
            color="#fff"
            fontSize={12}
            style={{ textAlign: 'center' }}
          >
            Ensure your device is connected to the sender's hotspot network
          </CustomText>
          <BreakerText text="or" />

          <TouchableOpacity
            style={styles.qrButton}
            onPress={() => setIsScannerVisible(prev => !prev)}
          >
            <Icon
              name="qrcode"
              iconFamily="MaterialCommunityIcons"
              color={Colors.primary}
              size={16}
            />
            <CustomText fontFamily="Okra-Bold" color={Colors.primary}>
              Show QR
            </CustomText>
          </TouchableOpacity>
        </View>

        <View style={styles.animationContainer}>
          <View style={styles.lottieContainer}>
            <LottieView
              style={styles.lottie}
              source={require('../../assets/animations/scan2.json')}
              autoPlay
              loop={true}
              hardwareAccelerationAndroid
            />
          </View>
          <Image
            source={require('../../assets/images/profile.jpg')}
            style={styles.profileImage}
          />
        </View>

        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Icon
            name="arrow-back"
            iconFamily="Ionicons"
            size={16}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      {isScannerVisible && (
        <QRGenerateModal
          visible={isScannerVisible}
          onClose={() => setIsScannerVisible(false)}
        />
      )}
    </LinearGradient>
  );
};

export default ReceiveScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#85CAFB',
  },
  mainContainer: {
    flex: 1,
  },
  infoContainer: {
    margin: 20,
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  qrButton: {
    backgroundColor: '#fff',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    borderRadius: 12,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.5,
    elevation: 5,
    shadowRadius: 20,
    shadowColor: '#fff',
  },
  lottieContainer: {
    position: 'absolute',
    zIndex: 4,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  animationContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: screenWidth,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    height: 30,
    width: 30,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    elevation: 5,
    shadowRadius: 5,
    shadowColor: '#888',
    backgroundColor: '#fff',
    position: 'absolute',
    top: 15,
    left: 15,
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 50,
    zIndex: 5,
  },
});
