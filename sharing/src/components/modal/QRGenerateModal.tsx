import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { multiColor, screenHeight } from '../../utils/Constants';
import Animated, {
  useSharedValue,
  Easing,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import CustomText from '../global/CustomText';
import Icon from '../global/Icon';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

const QRGenerateModal = ({ visible, onClose }: ModalProps) => {
  const [loading, setLoading] = useState(true);
  const [qrValue, setQRValue] = useState('');
  const shimmerTranslateX = useSharedValue(-300);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslateX.value }],
  }));

  useEffect(() => {
    shimmerTranslateX.value = withRepeat(
      withTiming(300, { duration: 1500, easing: Easing.linear }),
      -1,
      false,
    );
  }, [visible]);

  return (
    <Modal
      animationType="slide"
      visible={visible}
      presentationStyle="formSheet"
      onRequestClose={onClose}
      onDismiss={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.qrContainer}>
          {loading || qrValue === null || qrValue === '' ? (
            <View style={styles.skeleton}>
              <Animated.View style={[shimmerStyle]}>
                <LinearGradient
                  colors={['#f3f3f3', '#fff', '#f3f3f3']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ width: '100%', height: '100%' }}
                />
              </Animated.View>
            </View>
          ) : (
            <QRCode
              value={qrValue}
              size={250}
              logoSize={60}
              logoBackgroundColor="#fff"
              logoMargin={2}
              logoBorderRadius={10}
              logo={require('../../../assets/images/profile2.jpg')}
              linearGradient={multiColor}
              enableLinearGradient
            />
          )}
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            width: '100%',
          }}
        >
          <CustomText style={styles.infoText1}>
            Ensure you're on the same Wi-Fi network
          </CustomText>
          <CustomText style={styles.infoText2}>
            Ask the sender to scan this QR code to connect and transfer
          </CustomText>
        </View>
        <ActivityIndicator
          size={'small'}
          color={'#000'}
          style={{ alignSelf: 'center' }}
        />
        <TouchableOpacity onPress={() => onClose()} style={styles.closeButton}>
          <Icon iconFamily="Ionicons" name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default QRGenerateModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  qrContainer: {
    marginHorizontal: 20,
    marginTop: screenHeight * 0.12,
    padding: 20,
    borderColor: '#ccc',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  skeleton: {
    width: 250,
    height: 250,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  shimmerGradient: {
    width: '100%',
    height: '100%',
  },
  infoText1: {
    fontFamily: 'Okra-Medium',
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 20,
  },
  infoText2: {
    fontFamily: 'Okra-Medium',
    textAlign: 'center',
    fontSize: 14,
  },
  info: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 20,
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    elevation: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: '#888',
  },
});
