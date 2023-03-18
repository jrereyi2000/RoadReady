import React, { useContext, useState } from 'react';
import { View, Keyboard, KeyboardAvoidingView, SafeAreaView, Text, Pressable, Image } from 'react-native';
import CodeInput from '../../components/CodeInput';
import Button from '../../components/Button';
import { getStyle } from '../../css/Styles';
import AppContext from '../../AppContext';
import Config from 'react-native-config';
import base64 from 'react-native-base64';
import axios from 'axios';
import images from '../../../res/images';
import Keychain from 'react-native-keychain';
import { isDevNumber } from '../../utils';

const signIn = (navigation, mobile_num, setErr, state) => {
  axios.post(`${Config.HOST_URL}/api/signin`, { mobile_num: mobile_num.replace(/-/g, '') })
      .then((res) => {
        const user = res.data.user;
        Keychain.setGenericPassword(
            'session',
            JSON.stringify({ ...user }),
        );
        state.set_user(user);
        Keyboard.dismiss();
        navigation.navigate('Protected');
        return true;
      })
      .catch((err) => {
        console.log(err);
        console.log(err.response?.status);
        console.log(err?.response?.data);
        if (err.response?.status === 404) {
          navigation.navigate('Name');
        } else {
          setErr(err?.response?.data?.error);
        }

        return false;
      });
};

const checkCode = async (code, mobile_num) => {
  const authHeader =
    'Basic ' +
    base64.encode(`${Config.TWILIO_ACCOUNT_SID}:${Config.TWILIO_AUTH_TOKEN}`);

  const config = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': authHeader,
    },
  };

  const body = {
    To: `%2b1${mobile_num}`,
    Code: code,
  };

  if (isDevNumber(mobile_num)) return true;

  const url = `https://verify.twilio.com/v2/Services/${Config.TWILIO_SERVICE_SID}/VerificationCheck`;
  const st = await axios
      .post(
          url,
          Object.keys(body)
              .map((key) => key + '=' + body[key])
              .join('&'),
          config,
      )
      .then((res) => res.data.status)
      .catch((_) => {
        return 'canceled';
      });

  return st === 'approved';
};


const requestNewCode = (phoneNum) => {
  const authHeader =
    'Basic ' +
    base64.encode(`${Config.TWILIO_ACCOUNT_SID}:${Config.TWILIO_AUTH_TOKEN}`);

  const config = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': authHeader,
    },
  };

  const body = {
    To: `%2b1${phoneNum}`,
    Channel: 'sms',
  };

  const url = `https://verify.twilio.com/v2/Services/${Config.TWILIO_SERVICE_SID}/Verifications`;
  axios.post(
      url,
      Object.keys(body)
          .map((key) => key + '=' + body[key])
          .join('&'),
      config,
  )
      .then((res) => {})
      .catch((err) => {});
};

export const CodeScreen = ({ navigation }) => {
  const [state, dispatch, globalState] = useContext(AppContext);
  const [err, setErr] = useState(false);

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
            Enter Code
          </Text>
        </View>
        <CodeInput code={state.code} setCode={(code) => dispatch({ type: 'code', payload: code })} err={err} />
        <Pressable
          onPress={() => requestNewCode(state.mobile_num)}
          style={getStyle('height-40 marginTop-20 justifyContent-center')}
        >
          <Text style={getStyle('primaryFont')}>Request New Code</Text>
        </Pressable>
        {err && (
          <Text style={getStyle('color-redCandy marginTop-10')}>
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
            disabled={state.code.length !== 6}
            disabledButtonStyle={getStyle('width-50p height-45 borderRadius-20 backgroundColor-white marginBottom-10 borderWidth-2 borderColor-disabled')}
            disabledTextStyle={getStyle('fontSize-18 fontWeight-bold color-disabled primaryFont')}
            onPress={() => {
              const asyncFunc = async () => {
                const correct = await checkCode(state.code, state.mobile_num);
                if (correct) {
                  signIn(navigation, state.mobile_num, setErr, globalState);
                } else {
                  setErr('Incorrect Code. Please Try Again or Request a New Code');
                }
              };
              asyncFunc();
            }}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};
