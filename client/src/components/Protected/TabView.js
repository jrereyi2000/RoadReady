import React from 'react';
import { View, Image, Text } from 'react-native';
import { getStyle } from '../../css/Styles';

const TabView = ({ focused, focusedIcon, notFocusedIcon, text }) => {
  return (
    <View
      style={getStyle(
          'width-75 height-50 justifyContent-flex-end alignItems-center',
      )}>
      <Image
        style={getStyle('marginBottom-6')}
        source={focused ? focusedIcon : notFocusedIcon}
        resizeMethod={'resize'}
        resizeMode={'contain'}
      />
      <Text
        style={getStyle('fontSize-12 color-black primaryFont', {
          opacity: focused ? 1 : 0.6,
          fontWeight: focused ? 'bold' : 'normal',
        })}>
        {text}
      </Text>
    </View>
  );
};

export default TabView;
