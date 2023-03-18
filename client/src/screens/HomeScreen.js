import React, { useContext, useEffect } from 'react';
import { View, SafeAreaView, Text, Image } from 'react-native';
import Button from '../components/Button';
import { getStyle } from '../css/Styles';
import AppContext from '../AppContext';
import images from '../../res/images';

const HomeScreen = ({ navigation }) => {
  const appState = useContext(AppContext);
  useEffect(() => {
    appState.clear_state();
  }, []);

  return (
    <View style={getStyle('width-100p height-100p justifyContent-space-between alignItems-center backgroundColor-white')}>
      <SafeAreaView style={getStyle('width-100p height-100p justifyContent-space-between alignItems-center backgroundColor-white')}>
        <View style={getStyle('width-100p marginTop-20p alignItems-center')}>
          <Image
            style={getStyle('width-65p height-55p')}
            source={images.logo}
            resizeMethod="resize"
            resizeMode="contain"
          />
          <Text style={getStyle('fontWeight-bold primaryFont')}>Log issues on the go, and stay on the road.</Text>
        </View>
        <View style={getStyle('width-100p paddingLeft-8p paddingRight-8p')}>
          <Button
            buttonStyle={getStyle('width-100p height-60 backgroundColor-primary borderColor-primary borderRadius-100 borderWidth-2 marginBottom-6p justifyContent-center')}
            textStyle={getStyle(
                'fontSize-16 fontWeight-bold color-white primaryFont',
            )}
            text={'Join RoadReady'}
            onPress={() => navigation.navigate('Login')}
          />
          <Button
            buttonStyle={getStyle('width-100p height-60 borderColor-primary borderRadius-100 borderWidth-2 marginBottom-6p justifyContent-center')}
            textStyle={getStyle('fontWeight-bold fontSize-16 primaryFont color-primary')}
            text={'Login'}
            onPress={() => navigation.navigate('Login')}
          />
          <Text style={getStyle('primaryFont textAlign-center fontSize-11 lineHeight-14 letterSpacing-0.22')}>
            By using RoadReady you agree to our{' '}
            <Text style={getStyle('fontWeight-bold')}>
              Terms of Use
            </Text>
          </Text>
          <Text style={getStyle('primaryFont textAlign-center fontSize-11 lineHeight-14 letterSpacing-0.22')}>
            and{' '}
            <Text style={getStyle('fontWeight-bold')}>
              Privacy Policy
            </Text>
            .
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
