import React, { useContext, useState } from 'react';
import {
  View, Image, Text, SafeAreaView, Pressable,
} from 'react-native';
import { colors, getStyle } from '../css/Styles';
import AppContext from '../AppContext';
import images from '../../res/images';
import { LOGFIELDS } from '../utils';
import Button from '../components/Button';
import axios from 'axios';
import Config from 'react-native-config';
import { useFocusEffect } from '@react-navigation/native';

const initialState = Object.keys(LOGFIELDS).reduce((a, v) => ({ ...a, [v]: true }), {});

const submitLog = (setSubmitted, engine_pic, dolly_pic, tractor_pic) => {
  axios.post(`${Config.HOST_URL}/api/log`, { engine_pic, dolly_pic, tractor_pic })
      .then((res) => {
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err?.response?.data);
      });
};

const newLog = (logDispatch, pictureDispatch, globalState) => {
  for (const key of Object.keys(initialState)) {
    logDispatch({ type: key, payload: false });
  }
  pictureDispatch({ type: 'engine_pic', payload: '' });
  pictureDispatch({ type: 'dolly_pic', payload: '' });
  pictureDispatch({ type: 'tractor_pic', payload: '' });
  globalState.set_log(undefined);
};

const LogScreen = ({ navigation, route, globalState }) => {
  const [logState, logDispatch, pictureState, pictureDispatch] = useContext(AppContext);
  const [submitted, setSubmitted] = useState(false);
  const log = globalState.log;

  useFocusEffect(
      React.useCallback(() => {
        if (log) {
          for (const key of Object.keys(initialState)) {
            logDispatch({ type: key, payload: true });
          }
          pictureDispatch({ type: 'engine_pic', payload: log.engine_pic });
          pictureDispatch({ type: 'dolly_pic', payload: log.dolly_pic });
          pictureDispatch({ type: 'tractor_pic', payload: log.tractor_pic });
          setSubmitted(true);
        }
      }, [log]),
  );

  const viewStyle = getStyle(
      'height-100p width-100p alignItems-center backgroundColor-white paddingLeft-6p paddingRight-6p',
  );

  const { engine_pic, dolly_pic, tractor_pic } = pictureState;

  const date = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return (
    <View style={viewStyle}>
      <SafeAreaView style={getStyle('flex-1 width-100p')}>
        <View style={getStyle('width-100p alignItems-center')}>
          <Image style={getStyle('marginBottom-4p width-50 height-50')} source={require('../../res/images/logo.png')} />
        </View>
        <View style={getStyle('width-100p justifyContent-space-between marginBottom-20')}>
          <Text style={getStyle('fontSize-28 marginBottom-10')}>Hi {globalState.user?.name},</Text>
          <Text style={getStyle('fontSize-20')}> Today is {date.toLocaleDateString('en-US', options)}</Text>
        </View>
        {Object.keys(LOGFIELDS).map((div) => (
          <Pressable
            key={div}
            style={getStyle('height-50 borderRadius-10 marginBottom-10 paddingLeft-6p backgroundColor-white borderColor-primary flexDirection-row alignItems-center', {
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 4,
            })}
            onPress={() => navigation.navigate('LogEntry', { entry: div, submitted })}
          >
            <Image source={logState[div] ? images.selected : images.unselected} style={getStyle('width-25 height-25 marginRight-10')} />
            <Text style={getStyle('fontSize-18')}>{div}</Text>
          </Pressable>
        ))}
        {
          !Object.values(logState).includes(false) && (
            <Button
              buttonStyle={getStyle('width-100p height-60 position-absolute bottom-0 marginBottom-15p backgroundColor-white borderRadius-100 borderWidth-2 borderColor-primary', {
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
              })}
              text={submitted ? 'NEW' : 'SUBMIT'}
              textStyle={getStyle('fontSize-18 primaryFont fontWeight-bold color-primary')}
              onPress={() => submitted ? newLog(logDispatch, pictureDispatch, globalState) : submitLog(setSubmitted, engine_pic, dolly_pic, tractor_pic)}
            />
          )
        }
      </SafeAreaView>
    </View>
  );
};

export default LogScreen;
