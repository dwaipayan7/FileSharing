import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { useTCP } from '../service/TCPProvider';

const ConnectionScreen: FC = () => {
  const {
    connectedDevice,
    sentFiles,
    receivedFiles,
    totalSentBytes,
    totalReceivedBytes,
    sendFileAck,
    disconnect,
    isConnected,
  } = useTCP();
  return (
    <View>
      <Text>ConnectionScreen</Text>
    </View>
  );
};

export default ConnectionScreen;

const styles = StyleSheet.create({});
