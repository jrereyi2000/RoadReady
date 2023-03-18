import React from 'react';
import { View } from 'react-native';
import { getStyle } from '../css/Styles';

const SplashScreen = ({ navigation }) => {
  const viewStyle = getStyle(
      'height-100p width-100p alignItems-center bgNavy1000',
  );

  return <View style={viewStyle} />;
};

export default SplashScreen;
