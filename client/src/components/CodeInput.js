import React from 'react';
import { Pressable, View, TextInput, Text, Dimensions } from 'react-native';
import { getStyle } from '../css/Styles';

const inputStyle = getStyle('flexDirection-row marginTop-10p', {
  height: Dimensions.get('window').height * 0.054,
});
const numberInputStyle = getStyle(
    'height-100p borderBottomColor-primary borderBottomWidth-2',
    {
      width: Dimensions.get('window').width * 0.096,
      marginRight: Dimensions.get('window').width * 0.011,
    },
);
const errorNumberInputStyle = getStyle(
    'height-100p borderBottomColor-redCandy borderBottomWidth-2',
    {
      width: Dimensions.get('window').width * 0.096,
      marginRight: Dimensions.get('window').width * 0.011,
    },
);
const textStyle = getStyle('fontSize-32 textAlign-center');
const invisibleStyle = getStyle(
    'fontSize-32 textAlign-center color-white width-0 height-0',
);

const CodeInput = ({ code, setCode, err }) => {
  let input;
  const style = err ? errorNumberInputStyle : numberInputStyle;

  return (
    <View style={inputStyle}>
      <TextInput
        autoFocus={true}
        ref={(ref) => (input = ref)}
        style={invisibleStyle}
        autoCorrect={false}
        autoCapitalize={'none'}
        value={code}
        keyboardType={'numeric'}
        onChangeText={(param) => setCode(param)}
      />
      <Pressable style={style} onPress={() => input && input.focus()}>
        <Text style={textStyle}>{code[0] ?? ''}</Text>
      </Pressable>
      <Pressable style={style} onPress={() => input && input.focus()}>
        <Text style={textStyle}>{code[1] ?? ''}</Text>
      </Pressable>
      <Pressable style={style} onPress={() => input && input.focus()}>
        <Text style={textStyle}>{code[2] ?? ''}</Text>
      </Pressable>
      <Pressable style={style} onPress={() => input && input.focus()}>
        <Text style={textStyle}>{code[3] ?? ''}</Text>
      </Pressable>
      <Pressable style={style} onPress={() => input && input.focus()}>
        <Text style={textStyle}>{code[4] ?? ''}</Text>
      </Pressable>
      <Pressable style={style} onPress={() => input && input.focus()}>
        <Text style={textStyle}>{code[5] ?? ''}</Text>
      </Pressable>
    </View>
  );
};

export default CodeInput;
