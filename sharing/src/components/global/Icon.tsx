import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

interface IconProps {
  color?: string;
  size: number;
  name: string;
  iconFamily: 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons';
}

const Icon = ({ color, size, name, iconFamily }: IconProps) => {
  switch (iconFamily) {
    case 'Ionicons':
      return <Ionicons name={name} color={color} size={RFValue(size, 680)} />;
    case 'MaterialIcons':
      return (
        <MaterialIcons name={name} color={color} size={RFValue(size, 680)} />
      );
    case 'MaterialCommunityIcons':
      return (
        <MaterialCommunityIcons
          name={name}
          color={color}
          size={RFValue(size, 680)}
        />
      );

    default:
      return null;
  }
};

export default Icon;

// {iconFamily === 'Ionicons' && (
//         <Ionicons name={name} color={color} size={RFValue(size)} />
//     )}
