import React, { useContext } from 'react';
import {
  View,
} from 'react-native';
import { getStyle } from '../css/Styles';
import AppContext from '../AppContext';

const SentRequestsScreen = ({ navigation }) => {
  const appState = useContext(AppContext);
  const user = appState.user ?? {};

  const viewStyle = getStyle(
      'height-100p width-100p alignItems-center backgroundColor-white paddingLeft-6p paddingRight-6p',
  );

  return (
    <View style={viewStyle}>
    </View>
  );
};

export default SentRequestsScreen;
