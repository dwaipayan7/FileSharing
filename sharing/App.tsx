/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  Platform,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AppNavigation from './src/navigation/AppNavigation';
import { useEffect } from 'react';
import { requestPhotoPermission } from './src/utils/Constants';
import { checkFilePermissions } from './src/utils/libraryHelpers';

function App() {
  useEffect(() => {
    requestPhotoPermission(); // for ios
    checkFilePermissions(Platform.OS); // for android
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigation />
    </SafeAreaProvider>
  );
}

export default App;
