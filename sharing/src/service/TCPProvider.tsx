import { Buffer } from 'buffer';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { useChunkStore } from '../db/chunkStorage';
import TcpSocket from 'react-native-tcp-socket';
import DeviceInfo from 'react-native-device-info';

interface TCPContextType {
  server: any;
  client: any;
  isConnected: boolean;
  connectedDevice: any;
  sentFiles: any;
  receivedFiles: any;
  totalSentBytes: number;
  totalReceivedBytes: number;
  startServer: (port: number) => void;
  connectToServer: (host: string, port: number, deviceName: string) => void;
  sendMessage: (message: string | Buffer) => void;
  sendFileAck: (file: any, type: 'file' | 'image') => void;
  disconnect: () => void;
}

const TCPContext = createContext<TCPContextType | undefined>(undefined);

export const useTCP = (): TCPContextType => {
  const context = useContext(TCPContext);
  if (!context) {
    throw new Error('useTCP must be used within a TCPProvider');
  }
  return context;
};

const options = {
  keystore: require('../../tls_certs/server-keystore.p12'),
};

export const TCPProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [server, setServer] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<any>(null);
  const [serverSocket, setServerSocket] = useState<any>(null);
  const [sentFiles, setSentFiles] = useState<any>([]);
  const [receivedFiles, setReceivedFiles] = useState<any>([]);
  const [totalReceivedBytes, setTotalReceivedBytes] = useState<number>(0);
  const [totalSentBytes, setTotalSentBytes] = useState<number>(0);

  const { currentChunkSet, setCurrentChunkSet, setChunkStore } =
    useChunkStore();

  const startServer = useCallback(
    (port: number) => {
      if (server) {
        console.log('Server already running');
        return;
      }
      const newServer = TcpSocket.createTLSServer(options, socket => {
        console.log('Client Connected: ', socket.address());

        setServerSocket(socket);
        socket.setNoDelay(true);
        socket.readableHighWaterMark = 1024 * 1024 * 1;
        socket.writableHighWaterMark = 1024 * 1024 * 1;
      });
    },
    [server],
  );
  return (
    <TCPContext.Provider
      value={{
        server,
        client,
        connectedDevice,
        sentFiles,
        receivedFiles,
        totalReceivedBytes,
        totalSentBytes,
        isConnected,
        startServer,
        connectToServer,
        disconnect,
        sendMessage,
        sendFileAck,
      }}
    >
      {children}
    </TCPContext.Provider>
  );
};
