import React, { useContext, useEffect } from 'react';
import { View, Text, Pressable, Image, TextInput, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import Button from '../../components/Button';
import { getStyle } from '../../css/Styles';
import AppContext from '../../AppContext';
import images from '../../../res/images';
import Config from 'react-native-config';
import base64 from 'react-native-base64';
import axios from 'axios';

const handleMobileNumChange = (param, num, updateNum) => {
  if (
    (num.length === 3 && param.length === 4) ||
    (num.length === 7 && param.length === 8)
  ) {
    updateNum(param.slice(0, -1) + '-' + param.slice(-1));
  } else if ( num.length === 9 && param.length === 10 && /^\d+$/.test(param) ) {
    updateNum(`${param.slice(0, 3)}-${param.slice(3, 6)}-${param.slice(6)}`);
  } else {
    updateNum(param);
  }
};

const isFormatted = (num) => {
  return num[3] === '-' && num[7] === '-';
};

const isDevNumber = (num) => {
  return num.length === 12 && num.replace(/-/g, '').split('').every((char) => char === num[0]);
};

const isDisabled = (num) => {
  return !isDevNumber(num) && !num.match('[2-9][0-9][0-9]-[2-9][0-9][0-9]-[0-9][0-9][0-9][0-9]');
};

const authHeader =
  'Basic ' +
  base64.encode(`${Config.TWILIO_ACCOUNT_SID}:${Config.TWILIO_AUTH_TOKEN}`);

const sendCode = (mobile_num, navigation) => {
  const config = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': authHeader,
    },
  };

  const body = {
    To: `%2b1${mobile_num}`,
    Channel: 'sms',
  };

  if (isDevNumber(mobile_num)) {
    navigation.navigate('Code');
    return;
  }

  const url = `https://verify.twilio.com/v2/Services/${Config.TWILIO_SERVICE_SID}/Verifications`;

  axios
      .post(
          url,
          Object.keys(body)
              .map((key) => key + '=' + body[key])
              .join('&'),
          config,
      ).catch((err) => console.log(err.response?.data));
  navigation.navigate('Code');
};

const textStyle = getStyle('flex-1 fontSize-20');

export const PhoneNumberScreen = ({ navigation }) => {
  const [state, dispatch] = useContext(AppContext);
  const mobile_num = state.mobile_num;
  // let input;

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // console.log(input);
  //     input.focus();
  //   }, []),
  // );

  const updateNum = (text) => dispatch({ type: 'mobile_num', payload: text });

  useEffect(() => {
    if (mobile_num.length === 10 && /^\d+$/.test(mobile_num)) {
      const new_number = `${mobile_num.slice(0, 3)}-${mobile_num.slice(3, 6)}-${mobile_num.slice(6)}`;
      dispatch({ type: 'mobile_num', payload: new_number });
    } else if (mobile_num.length > 7 && !isFormatted(mobile_num)) {
      const strippedNum = mobile_num.replace(/-/g, '');
      const new_number = `${strippedNum.slice(0, 3)}-${strippedNum.slice(3, 6)}-${strippedNum.slice(6)}`;
      dispatch({ type: 'mobile_num', payload: new_number });
    }
  }, [mobile_num]);

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
        <View style={getStyle('marginTop-25p')}>
          <Text style={getStyle('fontSize-36 primaryFont fontWeight-bold')}>My number is</Text>
          <View style={getStyle('flexDirection-row borderBottomWidth-1 width-100p height-50 alignItems-center')}>
            <Image
              style={getStyle(
                  'height-20 marginTop-10 marginLeft-5 marginBottom-10 marginRight-10',
              )}
              source={images.us}
              resizeMethod="resize"
              resizeMode="contain"
            />
            <TextInput
              style={textStyle}
              // ref={(ref) => (input = ref)}
              autoCapitalize={'none'}
              autoFocus={true}
              value={mobile_num}
              keyboardType="numeric"
              onChangeText={(param) => handleMobileNumChange(param, mobile_num, updateNum)}
            />
            {mobile_num.length > 0 && (
              <Pressable onPress={() => dispatch({ type: 'mobile_num', payload: '' })}>
                <Image
                  style={getStyle(
                      'height-20 marginTop-10 marginLeft-5 marginBottom-10 marginRight-4',
                  )}
                  source={images.closeIcon}
                  resizeMethod="resize"
                  resizeMode="contain"
                />
              </Pressable>
            )}
          </View>
        </View>
        <View style={getStyle('marginTop-10p')}>
          <Text style={getStyle('color-grey primaryFont')}>We will send a text with a verification code.</Text>
          <Text style={getStyle('color-grey primaryFont')}>Message and data rates may apply.</Text>
        </View>
        <KeyboardAvoidingView
          behavior='padding'
          style={getStyle('flex-1 justifyContent-flex-end alignItems-center')}
        >
          <Button
            buttonStyle={getStyle('width-50p height-45 borderRadius-20 backgroundColor-white marginBottom-10 borderWidth-2 borderColor-primary')}
            text="CONTINUE"
            textStyle={getStyle('fontSize-18 fontWeight-bold color-primary primaryFont')}
            disabled={isDisabled(mobile_num)}
            disabledButtonStyle={getStyle('width-50p height-45 borderRadius-20 backgroundColor-white marginBottom-10 borderWidth-2 borderColor-disabled')}
            disabledTextStyle={getStyle('fontSize-18 fontWeight-bold color-disabled primaryFont')}
            onPress={() => sendCode(mobile_num, navigation)}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};
