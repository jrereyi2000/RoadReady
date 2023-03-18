import React, { useContext, useReducer, useState, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Image, Text, Pressable } from 'react-native';
import { getStyle, colors } from '../css/Styles';
import AppContext from '../AppContext';
import { LOGFIELDS, reducer, getBlob, blobToBase64, uploadImageOnS3 } from '../utils';
import images from '../../res/images';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import Button from '../components/Button';

const getType = (entry) => {
  if (entry === 'Engine Compartment') return 'engine_pic';
  if (entry === 'Dolly - Coupling System') return 'dolly_pic';
  if (entry === 'Tractor Frame') return 'tractor_pic';
  return '';
};

const LogEntryScreen = (props) => {
  const { navigation, route } = props;

  const [logState, logDispatch, pictureState, pictureDispatch] = useContext(AppContext);
  const cameraRef = useRef(null);

  const [camera, openCamera] = useState(false);
  const [permissions, setPermissions] = useState(false);

  const entry = route.params?.entry ?? '';
  const submitted = route.params?.submitted ?? false;

  if (!entry) navigation.goBack();

  const entryObj = LOGFIELDS[entry].reduce((a, v) => ({ ...a, [v]: logState[entry] }), {});

  const [state, dispatch] = useReducer(reducer, entryObj);

  const devices = useCameraDevices();
  const device = devices.back;

  Camera.getCameraPermissionStatus().then((res) => {
    if (res === 'not-determined') {
      Camera.requestCameraPermission().then((permissionRes) => {
        setPermissions(permissionRes === 'authorized');
      });
    } else if (res === 'authorized') {
      setPermissions(true);
    }
  });

  const viewStyle = getStyle(
      'height-100p width-100p alignItems-center backgroundColor-white',
  );

  const cameraUpload = LOGFIELDS[entry][LOGFIELDS[entry].length - 1];
  return (
    <View style={viewStyle}>
      { device && camera && permissions ? (
          <View style={getStyle('width-100p height-100p backgroundColor-white zIndex-1', StyleSheet.absoluteFill)}>
            <Camera
              style={[getStyle('width-100p height-90p')]}
              device={device}
              ref={cameraRef}
              {...props}
              photo={true}
              isActive={true}
            />
            <View style={getStyle('width-100p height-10p backgroundColor-white alignItems-center justifyContent-center')}>
              <Pressable
                style={getStyle('height-50 width-50 borderRadius-25 backgroundColor-primary alignItems-center justifyContent-center')}
                onPress={() => {
                  cameraRef.current.takePhoto({
                    flash: 'on',
                    enableAutoRedEyeReduction: true,
                  }).then((photoFile) => {
                    const func = async () => {
                      openCamera(false);
                      pictureDispatch({ type: getType(entry), payload: `file://${photoFile.path}` });

                      const blob = await getBlob(`file://${photoFile.path}`);
                      const base64 = await blobToBase64(blob);
                      const res = await uploadImageOnS3(base64, uuidv4());

                      pictureDispatch({ type: getType(entry), payload: res });
                      dispatch({ type: cameraUpload, payload: !state[cameraUpload] });
                    };
                    func();
                  });
                }}
              >
                <View style={getStyle('height-40 width-40 borderRadius-20 backgroundColor-white')} />
              </Pressable>
            </View>
          </View>
          ) : <View />
      }
      <SafeAreaView style={getStyle('flex-1 width-100p')}>
        <View style={getStyle('marginBottom-4p paddingLeft-6p paddingRight-6p marginTop-2p justifyContent-center alignItems-flex-start flexDirection-row')}>
          <Pressable
            style={getStyle('flex-1')}
            onPress={() => navigation.goBack()}>
            <Image
              style={getStyle('height-24 width-24')}
              source={images.backIcon}
            />
          </Pressable>
          <Image
            style={getStyle('flex-1 width-50 height-50')}
            resizeMethod="resize"
            resizeMode="contain"
            source={images.logo}
          />
          <View style={getStyle('flex-1')} />
        </View>
        <View
          style={getStyle(
              'width-100p  paddingLeft-6p justifyContent-space-between marginBottom-20',
          )}>
          <Text style={getStyle('fontSize-28 primaryFont fontWeight-bold marginBottom-10')}>{entry}</Text>
        </View>
        {LOGFIELDS[entry].map((field) => (
          <Pressable
            key={field}
            disabled={field.split(' ')[0] === 'Insert' || submitted}
            onPress={() => dispatch({ type: field, payload: !state[field] })}
            style={getStyle('borderRadius-10 marginBottom-10 marginLeft-6p marginRight-6p paddingLeft-6p paddingRight-12p borderColor-primary borderWidth-2')}
          >
            <View style={getStyle('height-50 alignItems-center flexDirection-row')}>
              <Image
                source={state[field] ? images.selected : images.unselected}
                style={getStyle('width-25 height-25 marginRight-10')}
              />
              <Text style={getStyle('fontSize-18 primaryFont')}>{field}</Text>
            </View>
            {
              field.split(' ')[0] === 'Insert' ? (
                <Pressable
                  style={getStyle('width-100p height-200 marginTop-4p marginBottom-10p alignItems-center')}
                  onPress={() => {
                    if (device && permissions && !submitted) {
                      openCamera(true);
                    } else if (!submitted) {
                      dispatch({ type: cameraUpload, payload: !state[cameraUpload] });
                    }
                  }}
                >
                  <Image
                    source={pictureState[getType(entry)] ? { uri: pictureState[getType(entry)] } : images.upload}
                    resizeMethod="resize"
                    resizeMode="contain"
                    style={getStyle('width-80p flex-1 borderRadius-10 borderWidth-6 borderColor-primary', {
                      shadowColor: colors.primary,
                      shadowOffset: { width: -2, height: -4 },
                      shadowOpacity: 0.6,
                      shadowRadius: 4,
                    })}
                  />
                </Pressable>
              ) : <View />
            }
          </Pressable>
        ))}
        <View style={getStyle('width-100p flex-1 justifyContent-flex-end paddingLeft-6p paddingRight-6p alignItems-center')}>
          <Button
            buttonStyle={getStyle('width-100p height-60 borderRadius-100 borderWidth-2 borderColor-primary marginBottom-10')}
            disabled={Object.values(state).includes(false)}
            disabledButtonStyle={getStyle('width-100p height-60 borderRadius-100 borderWidth-2 opacity-0.1 borderColor-grey marginBottom-10')}
            disabledTextStyle={getStyle('fontSize-18 primaryFont fontWeight-bold color-grey')}
            text="SUBMIT"
            textStyle={getStyle('fontSize-18 primaryFont fontWeight-bold color-primary')}
            onPress={() => {
              logDispatch({ type: entry, payload: true });
              navigation.goBack();
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default LogEntryScreen;
