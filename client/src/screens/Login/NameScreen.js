import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import Button from '../../components/Button';
import { getStyle } from '../../css/Styles';
import AppContext from '../../AppContext';
import images from '../../../res/images';
import Input from '../../components/Input';
import axios from 'axios';
import Config from 'react-native-config';
import Keychain from 'react-native-keychain';

const signUp = (navigation, mobile_num, badge_id, setErr, state) => {
  axios.post(`${Config.HOST_URL}/api/signup`, { mobile_num: mobile_num.replace(/-/g, ''), badge_id })
      .then((res) => {
        const user = res.data.user;
        Keychain.setGenericPassword(
            'session',
            JSON.stringify({ ...user }),
        );
        state.set_user(user);
        Keyboard.dismiss();
        navigation.navigate('Protected');
      })
      .catch((err) => {
        console.log(err.response?.data?.error);
        setErr(err.response?.data?.error);
      });
};


export const NameScreen = ({ navigation }) => {
  const [state, dispatch, globalState] = useContext(AppContext);
  const [err, setErr] = useState(undefined);

  const textStyle = getStyle('flex-1 fontSize-20');

  const setId = (id) => dispatch({ type: 'id', payload: id });

  return (
    <View style={getStyle('width-100p height-100p paddingLeft-8p paddingRight-8p backgroundColor-white')}>
      <SafeAreaView style={getStyle('flex-1')}>
        <View style={getStyle('marginTop-2p justifyContent-center alignItems-flex-start flexDirection-row')}>
          <Pressable
            style={getStyle('flex-1')}
            onPress={() => navigation.goBack()}>
            <Image
              style={getStyle('height-24 width-24')}
              source={images.backIcon}
            />
          </Pressable>
          <Image
            style={getStyle('flex-1 height-80')}
            resizeMethod="resize"
            resizeMode="contain"
            source={images.logo}
          />
          <View style={getStyle('flex-1')} />
        </View>
        <View style={getStyle('marginTop-7p')}>
          <Text
            style={getStyle('fontSize-28 primaryFont')}>
            Enter Your Badge Id
          </Text>
        </View>
        <Input
          inputStyle={getStyle('width-100p height-60 borderBottomWidth-1 alignItems-center')}
          textStyle={textStyle}
          autoFocus
          value={state.id}
          keyboardType="numeric"
          autoCorrect={false}
          endIcon={state.id ? images.closeIcon : undefined}
          onChange={(param) => param.length <= 10 ? setId(param) : ''}
          onEndIconPress={() => setId('')}
        />
        <View style={getStyle('marginTop-10p')}>
          <Text style={getStyle('color-grey primaryFont')}>Please enter your 10-digit badge ID number.</Text>
          <Text style={getStyle('color-grey primaryFont')}>Message and data rates may apply.</Text>
        </View>
        {err && (
          <Text style={getStyle('color-redCandy marginTop-2p fontSize-12')}>
            {err}
          </Text>
        )}
        <KeyboardAvoidingView
          behavior='padding'
          style={getStyle('flex-1 justifyContent-flex-end alignItems-center')}
        >
          <Button
            buttonStyle={getStyle('width-50p height-45 borderRadius-20 backgroundColor-white marginBottom-10 borderWidth-2 borderColor-primary')}
            text="CONTINUE"
            textStyle={getStyle('fontSize-18 fontWeight-bold color-primary primaryFont')}
            disabled={state.id.length !== 10}
            disabledButtonStyle={getStyle('width-50p height-45 borderRadius-20 backgroundColor-white marginBottom-10 borderWidth-2 borderColor-disabled')}
            disabledTextStyle={getStyle('fontSize-18 fontWeight-bold color-disabled primaryFont')}
            onPress={() => signUp(navigation, state.mobile_num, state.id, setErr, globalState)}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};
