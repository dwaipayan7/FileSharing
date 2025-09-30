import {
  View,
  Text,
  Platform,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import RNFS from 'react-native-fs';
import Icon from '../components/global/Icon';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomText from '../components/global/CustomText';
import { Colors } from '../utils/Constants';
import { connectionStyles } from '../styles/connectionStyles';
import { formatFileSize } from '../utils/libraryHelpers';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { goBack } from '../utils/NavigationUtil';

const ReceivedFileScreen: FC = () => {
  const [receivedFiles, setReceivedFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getFilesFromDirectory = async () => {
    setIsLoading(true);
    const platformPath =
      Platform.OS === 'android'
        ? `${RNFS.DownloadDirectoryPath}/`
        : `${RNFS.DocumentDirectoryPath}/`;

    try {
      const exists = await RNFS.exists(platformPath);
      if (!exists) {
        setReceivedFiles([]);
        setIsLoading(false);
        return;
      }

      const files = await RNFS.readDir(platformPath);

      const formattedFiles = files.map(file => ({
        id: file.name,
        name: file.name,
        size: file.size,
        uri: file.path,
        mimeType: file.name.split('.').pop() || 'unknown',
      }));

      setReceivedFiles(formattedFiles);
    } catch (error) {
      console.log('Error fething files: ', error);
      setReceivedFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFilesFromDirectory();
  }, []);

  const renderThumbnail = (mimeType: string) => {
    switch (mimeType) {
      case 'mp3':
        return (
          <Icon
            name="musical-notes"
            size={16}
            color="blue"
            iconFamily="Ionicons"
          />
        );
      case 'mp4':
        return (
          <Icon name="videocam" size={16} color="green" iconFamily="Ionicons" />
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
        return (
          <Icon name="image" size={16} color="orange" iconFamily="Ionicons" />
        );
      case 'pdf':
        return (
          <Icon name="document" size={16} color="red" iconFamily="Ionicons" />
        );
      default:
        return (
          <Icon
            name="document-text"
            size={16}
            color="gray"
            iconFamily="Ionicons"
          />
        );
    }
  };

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.fileItem}>
        <View style={connectionStyles.fileInfoContainer}>
          {renderThumbnail(item?.mimeType)}
          <View style={connectionStyles.fileDetails}>
            <CustomText numberOfLines={1} fontFamily="Okra-Bold" fontSize={14}>
              {item.name}
            </CustomText>
            <CustomText
              numberOfLines={1}
              fontFamily="Okra-Medium"
              fontSize={14}
            >
              {item.mimeType} . {formatFileSize(item.size)}
            </CustomText>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            const nomalizedPath =
              Platform.OS === 'ios' ? `file://${item?.uri}` : item?.uri;
            if (Platform.OS === 'ios') {
              ReactNativeBlobUtil.ios
                .openDocument(nomalizedPath)
                .then(() => console.log('File Opened successfully'))
                .catch(err => console.log('Error opening file: ', err));
            } else {
              ReactNativeBlobUtil.android
                .actionViewIntent(nomalizedPath, '*/*')
                .then(() => console.log('File opend successfylly'))
                .catch(err => console.log('Error opening file: ', err));
            }
          }}
          style={connectionStyles.openButton}
        >
          <CustomText
            numberOfLines={1}
            color="#fff"
            fontFamily="Okra-Bold"
            fontSize={12}
          >
            Open
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#cddaee', '#8dbaff']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <SafeAreaView />

      <View style={styles.mainContainer}>
        <CustomText
          fontFamily="Okra-Bold"
          fontSize={15}
          color="#fff"
          style={{ textAlign: 'center', margin: 10 }}
        >
          All Received Files
        </CustomText>
        {isLoading ? (
          <ActivityIndicator size={'small'} color={Colors.primary} />
        ) : receivedFiles.length > 0 ? (
          <View>
            <FlatList
              data={receivedFiles}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ padding: 10 }}
            />
          </View>
        ) : (
          <View style={connectionStyles.noDataContainer}>
            <CustomText
              numberOfLines={1}
              fontFamily="Okra-Medium"
              fontSize={11}
            >
              No files received yet
            </CustomText>
          </View>
        )}
      </View>

      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Icon name="arrow-back" iconFamily="Ionicons" size={16} color="#000" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default ReceivedFileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#85CAFB',
  },
  mainContainer: {
    flex: 1,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  fileDetails: {
    marginLeft: 10,
    width: '70%',
  },
  backButton: {
    padding: 4,
    borderRadius: 100,
    zIndex: 4,
    position: 'absolute',
    top: 10,
    left: 10,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    elevation: 5,
    shadowRadius: 5,
    shadowColor: '#888',
    backgroundColor: '#fff',
  },
});
