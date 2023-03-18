import React, { useContext, useState } from 'react';
import {
  View, SafeAreaView, Pressable, Image, Text, FlatList,
} from 'react-native';
import { getStyle, colors } from '../css/Styles';
import AppContext from '../AppContext';
import images from '../../res/images';
import axios from 'axios';
import Config from 'react-native-config';
import Keychain from 'react-native-keychain';
import Button from '../components/Button';
import { useFocusEffect } from '@react-navigation/native';

const signOut = (navigation) => {
  axios.post(`${Config.HOST_URL}/api/signOut`, {})
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });

        Keychain.resetGenericPassword();
      })
      .catch((err) => {
        console.log(err);
        console.log({ ...err });
      });
};

const ProfileScreen = ({ navigation, globalState }) => {
  const { user } = useContext(AppContext);
  const [logs, setLogs] = useState([]);

  useFocusEffect(
      React.useCallback(() => {
        axios.get(`${Config.HOST_URL}/api/logs`)
            .then((res) => {
              setLogs(res.data);
            })
            .catch((err) => {
              console.log(err?.response?.data);
            });
      }, []),
  );

  return (
    <View style={getStyle('width-100p height-100p paddingLeft-8p paddingRight-8p backgroundColor-white')}>
      <SafeAreaView style={getStyle('flex-1')}>
        <View style={getStyle('marginTop-2p justifyContent-center alignItems-flex-start flexDirection-row')}>
          <View style={getStyle('flex-1')} />
          <Image
            style={getStyle('flex-1 height-80')}
            resizeMethod="resize"
            resizeMode="contain"
            source={images.logo}
          />
          <View style={getStyle('flex-1 alignItems-flex-end')}>
            <Button
              buttonStyle={getStyle('height-50 borderRadius-10 borderWidth-1 borderColor-primary')}
              onPress={() => signOut(navigation)}
              text="Sign Out"
              textStyle={getStyle('color-primary primaryFont')}
            />
          </View>
        </View>
        <View style={getStyle('marginTop-7p width-100p alignItems-center')}>
          <Image
            style={getStyle('height-84 width-84 borderColor-primary borderWidth-4 borderRadius-80 marginBottom-20')}
            resizeMethod="resize"
            resizeMode="contain"
            source={images.profileIcon}
          />
          <Text style={getStyle('fontSize-32 fontWeight-bold primaryFont')}>{user.name}</Text>
        </View>
        <View style={getStyle('marginTop-6p flex-1 width-100p marginBottom-6p')}>
          {logs.length > 0 && <Text style={getStyle('fontSize-20 primaryFont marginBottom-10p')}>Past Logs:</Text>}
          <FlatList
            style={getStyle('width-100p height-100p')}
            data={logs}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              return (
                <Pressable
                  onPress={() => {
                    globalState?.set_log(item);
                    navigation.navigate('LogTab', { screen: 'Log' });
                  }}
                  style={getStyle('width-100p height-60 paddingLeft-6p paddingBottom-10 paddingRight-6p backgroundColor-white alignItems-center justifyContent-space-between flexDirection-row', {
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 4,
                  })}>
                  <Text style={getStyle('primaryFont')}>{new Date(item.date).toLocaleString()}</Text>
                  <View style={getStyle('flexDirection-row alignItems-center')}>
                    <Text style={getStyle('fontWeight-bold color-primary primaryFont')}>VIEW LOG</Text>
                    <Image
                      source={images.rightSalmon}
                      style={getStyle('height-12 marginLeft-6')}
                      resizeMethod="resize"
                      resizeMode='contain'
                    />
                  </View>
                </Pressable>
              );
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ProfileScreen;
