import { Platform, StyleSheet, Text, TextStyle, View } from 'react-native';
import React, { ReactNode } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../utils/Constants';

type PlatformType = 'android' | 'ios';

type Variant =
  | 'bold'
  | 'regular'
  | 'black'
  | 'light'
  | 'medium'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'h7';

interface CustomTextProps {
  variant?: Variant;
  fontFamily?:
    | 'Okra-Bold'
    | 'Okra-Regular'
    | 'Okra-Black'
    | 'Okra-Light'
    | 'Okra-Medium';
  fontSize?: number;
  color?: string;
  style?: TextStyle | TextStyle[];
  children?: ReactNode;
  numberOfLines?: number;
  onLayout?: (event: any) => void;
}

const fontSizeMap: Record<
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7',
  Record<PlatformType, number>
> = {
  h1: { android: 24, ios: 22 },
  h2: { android: 22, ios: 20 },
  h3: { android: 20, ios: 18 },
  h4: { android: 18, ios: 16 },
  h5: { android: 16, ios: 14 },
  h6: { android: 12, ios: 10 },
  h7: { android: 10, ios: 9 },
};

const CustomText = ({
  variant,
  fontFamily = 'Okra-Regular',
  fontSize,
  style,
  color,
  children,
  numberOfLines,
  onLayout,
  ...props
}: CustomTextProps) => {
  let computedFontSize: number;

  // Use variant default size if applicable, otherwise use provided fontSize or fallback
  if (variant && fontSizeMap[variant as keyof typeof fontSizeMap]) {
    const defaultSize =
      fontSizeMap[variant as keyof typeof fontSizeMap][
        Platform.OS as PlatformType
      ];
    computedFontSize = RFValue(fontSize || defaultSize, 680);
  } else {
    // fallback font size
    computedFontSize = RFValue(fontSize || 14, 680);
  }

  return (
    <Text
      onLayout={onLayout}
      style={[
        styles.text,
        { color: color || Colors.text, fontSize: computedFontSize, fontFamily },
        style,
      ]}
      numberOfLines={numberOfLines}
      {...props}
    >
      {children}
    </Text>
  );
};

export default CustomText;

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});
