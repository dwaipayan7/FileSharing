import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Icon from '../global/Icon';
import { Colors } from '../../utils/Constants';
import CustomText from '../global/CustomText';

type OptionsProps = {
  isHome?: boolean;
  onMediaPickedUp?: (media: any) => void;
  onFilePickedUp?: (file: any) => void;
};

const Options = ({ isHome, onFilePickedUp, onMediaPickedUp }: OptionsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.subContainer}
        onPress={() => {
           ;
        }}
      >
        <Icon
          iconFamily="Ionicons"
          name="images"
          color={Colors.primary}
          size={20}
        />
        <CustomText
          fontFamily="Okra-Medium"
          style={{ marginTop: 4, textAlign: 'center' }}
          fontSize={10}
        >
          Photo
        </CustomText>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.subContainer}
        onPress={() => {
           ;
        }}
      >
        <Icon
          iconFamily="Ionicons"
          name="musical-notes-sharp"
          color={Colors.primary}
          size={20}
        />
        <CustomText
          fontFamily="Okra-Medium"
          style={{ marginTop: 4, textAlign: 'center' }}
          fontSize={10}
        >
          Audio
        </CustomText>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.subContainer}
        onPress={() => {
           ;
        }}
      >
        <Icon
          iconFamily="Ionicons"
          name="folder-open"
          color={Colors.primary}
          size={20}
        />
        <CustomText
          fontFamily="Okra-Medium"
          style={{ marginTop: 4, textAlign: 'center' }}
          fontSize={10}
        >
          Files
        </CustomText>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.subContainer}
        onPress={() => {
           ;
        }}
      >
        <Icon
          iconFamily="MaterialCommunityIcons"
          name="contacts"
          color={Colors.primary}
          size={20}
        />
        <CustomText
          fontFamily="Okra-Medium"
          style={{ marginTop: 4, textAlign: 'center' }}
          fontSize={10}
        >
          Contacts
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default Options;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    elevation: 5,
    shadowRadius: 5,
    shadowColor: '#888',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 26,
    borderColor: '#eee',
  },
  subContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
