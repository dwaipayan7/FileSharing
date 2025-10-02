import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { useTCP } from '../service/TCPProvider';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendStyles } from '../styles/sendStyles';
import QRScannerModal from '../components/modal/QRScannerModal';
import { Colors, screenWidth } from '../utils/Constants';
import Icon from '../components/global/Icon';
import LottieView from 'lottie-react-native';
import BreakerText from '../components/ui/BreakerText';
import CustomText from '../components/global/CustomText';
import { goBack, navigate } from '../utils/NavigationUtil';
import dgram, { Buffer } from 'react-native-udp';

const deviceNames = ['Oppo', 'Iqoo', 'realme', 'apple'];

const SendScreen: FC = () => {
  const { connectToServer, isConnected } = useTCP();

  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [nearbyDevices, setNearbyDevices] = useState<any[]>([]);

  const handleScan = (data: any) => {
    const [connectionData, deviceName] = data.replace('tcp://', '').split('|');
    const [host, port] = connectionData?.split(':');
    connectToServer(host, parseInt(port, 10), deviceName);
  };

  const listenForDevices = async () => {
    const server = dgram.createSocket({ type: 'udp4', reusePort: true });

    const port = 57143;
    server.bind(port, () => {
      console.log(`Listening for nearby devices on port ${port}...`);
    });

    // 👇 cast to `any` to bypass the wrong typing
    (server as any).on('message', (msg: Buffer, info: any) => {
      const [connectionData, otherDevice] = msg
        ?.toString()
        ?.replace('tcp://', '')
        ?.split('|');

      console.log('Received from device:', {
        connectionData,
        otherDevice,
        info,
      });

      setNearbyDevices(prevDevices => {
        const deviceExists = prevDevices?.some(
          device => device?.name === otherDevice,
        );
        if (!deviceExists) {
          const newDevice = {
            id: `${Date.now()}_${Math.random()}`,
            name: otherDevice,
            image: require('../../assets/icons/device.jpeg'),
            fullAddress: msg?.toString(),
            position: getRandomPosition(
              150,
              prevDevices?.map(d => d.position),
              50,
            ),
            scale: new Animated.Value(0),
          };

          Animated.timing(newDevice.scale, {
            toValue: 1,
            duration: 1500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start();

          return [...prevDevices, newDevice];
        }

        return prevDevices;
      });
    });
  };

  const getRandomPosition = (
    radius: number,
    existingPosition: { x: number; y: number }[],
    minDistance: number,
  ) => {
    let position: any;
    let isOverlapping;

    do {
      const angle = Math.random() * 360;
      const distance = Math.random() * (radius - 50) + 50;
      const x = distance * Math.cos((angle + Math.PI) / 180);
      const y = distance * Math.sin((angle + Math.PI) / 180);

      position = { x, y };
      isOverlapping = existingPosition.some(pos => {
        const dx = pos.x - position.x;
        const dy = pos.y - position;
        return Math.sqrt(dx * dx + dy * dy) < minDistance;
      });
    } while (isOverlapping);
    return position;
  };

  useEffect(() => {
    if (isConnected) {
      navigate('ConnectionScreen');
    }
  }, [isConnected]);

  useEffect(() => {
    let udpServer: any;
    const setupServer = async () => {
      udpServer = await listenForDevices();
    };
    setupServer();

    return () => {
      if (udpServer) {
        udpServer.close(() => {
          console.log('UDP server closed');
        });
      }
      setNearbyDevices([]);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (nearbyDevices.length < deviceNames.length) {
        const newDevice = {
          id: `${nearbyDevices.length + 1}`,
          name: deviceNames[nearbyDevices.length],
          image: require('../../assets/icons/device.jpeg'),
          position: getRandomPosition(
            150,
            nearbyDevices.map(d => d.position),
            50,
          ),
          scale: new Animated.Value(0),
        };

        setNearbyDevices(prevDevices => [...prevDevices, newDevice]);

        Animated.timing(newDevice.scale, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      } else {
        clearInterval(timer);
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [nearbyDevices]);

  return (
    <LinearGradient
      colors={['#ffffff', '#b689ed', '#a066e5']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={sendStyles.container}
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
            Looking for nearby devices
          </CustomText>
          <CustomText
            fontFamily="Okra-Medium"
            color="#fff"
            fontSize={12}
            style={{ textAlign: 'center' }}
          >
            Ensure your device's hotspot is active and the reciver device is
            connected to it
          </CustomText>
          <BreakerText text="or" />

          <TouchableOpacity
            style={styles.qrButton}
            onPress={() => setIsScannerVisible(prev => !prev)}
          >
            <Icon
              name="qrcode-scan"
              iconFamily="MaterialCommunityIcons"
              color={Colors.primary}
              size={16}
            />
            <CustomText fontFamily="Okra-Bold" color={Colors.primary}>
              Scan QR
            </CustomText>
          </TouchableOpacity>
        </View>

        <View style={styles.animationContainer}>
          <View style={styles.lottieContainer}>
            <LottieView
              style={styles.lottie}
              source={require('../../assets/animations/scanner.json')}
              autoPlay
              loop={true}
              hardwareAccelerationAndroid
            />

            {nearbyDevices?.map(device => (
              <Animated.View
                key={device?.id}
                style={[
                  sendStyles.deviceDot,
                  {
                    transform: [{ scale: device.scale }],
                    left: screenWidth / 2.33 + device.position?.x,
                    top: screenWidth / 2.2 + device.position?.y,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => handleScan(device?.fullAddress)}
                  style={styles.backButton}
                >
                  <Image source={device.image} style={sendStyles.deviceImage} />
                  {/* <Icon
                    name="arrow-back"
                    iconFamily="Ionicons"
                    size={16}
                    color="#000"
                  /> */}
                  <CustomText
                    color="black"
                    fontFamily="Okra-Bold"
                    fontSize={8}
                    numberOfLines={1}
                    style={{
                      marginTop: 5,
                    }}
                  >
                    {device?.name}
                  </CustomText>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
          <Image
            source={require('../../assets/images/profile.jpg')}
            style={sendStyles.profileImage}
          />
        </View>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Icon
            name="arrow-back"
            iconFamily="Ionicons"
            size={16}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      {isScannerVisible && (
        <QRScannerModal
          visible={isScannerVisible}
          onClose={() => setIsScannerVisible(false)}
        />
      )}
    </LinearGradient>
  );
};

export default SendScreen;

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
