import { StyleSheet } from 'react-native';

const customStyles = {
  'border': {
    borderColor: 'black',
    borderWidth: 1,
  },
  'primaryFont': {
    fontFamily: 'Palatino-Roman',
  },
};

/**
 * getStyle is a function that parses style strings into style objects for use
 * in component design.
 *
 * styleStr will be of the format `style1 style2 style3...`
 *
 * Each style should be formatted `propertyName-propertyValue`
 * (Ex. `width-100` would be interpreted as the key-value pair { width: 100 }.)
 *
 * To set percentages for style values, add the 'p' keyword after the value.
 * To use a negative value, add the 'n' keyword before the value.
 * (Ex. 'marginTop-n40p would be interpreted as the key-value pair { marginTop: -40% })
 *
 * @param {string} styleStr Space separated string of style values
 * @param {Object} extraStyles Additional styles not interpreted by the parser
 * @return {Object[]} Array containing formed style object and extra styles
 */
export const getStyle = (styleStr, extraStyles = {}) => {
  const allStyles = styleStr.split(' ');

  const styleObj = {};
  for (const style of allStyles) {
    if (style in customStyles) {
      Object.assign(styleObj, customStyles[style]);
      continue;
    }

    // Split string by - and assign first token to variable
    // justifyContent-space-between => justifyContent, [space, between]
    let [name, ...val] = style.split('-');

    // Recombine rest of string
    // justifyContent, [space, between] => justifyContent, space-between
    val = val.join('-');

    // If value ends with p, substitute with %
    if (val?.slice(-1) === 'p') val = `${val.slice(0, val.length - 1)}%`;

    // If value starts with n, substitute with -
    if (val[0] === 'n') val = `-${val.slice(1)}`;

    // Replace color with corresponding hex value.
    if (val in colors) val = colors[val];

    // Turn numeric values to numbers
    if (!isNaN(val)) val = parseInt(val);


    styleObj[name] = val;
  }

  return [StyleSheet.create(styleObj), extraStyles];
};

export const colors = {
  vipTangerine: '#ff8264',
  vipBlue: '#65a7fe',
  redCandy: '#ff441f',
  purpleKush: '#a100f3',
  electricBlueberry: '#2d28ff',
  slidePassGreen: '#4bff7a',
  slurple: '#a699f0',
  spearmint: '#92d8b4',
  linearGradient: '#72a7f7',
  bgBlurTop: 'rgba(24, 27, 49, 0.7)',
  bgBlurBottom: 'rgba(24, 27, 49, 0.7)',
  bgNavy1000: '#0d0f20',
  navy900: '#181b31',
  navy800: '#232745',
  navy700: '#383f6c',
  grey300: '#828ec6',
  grey200: '#9baad4',
  grey100: '#b2c2f1',
  white: '#ffffff',
  black: '#000000',
  deepSupport: '#4380fa',
  sky: '#c1e5fc',
  salmon: '#ea7c79',
  cocoa: '#7b6d6c',
  melon: '#f4ada6',
  primary: '#94d669',
  disabled: '#rgba(0, 0, 0, 0.18)',
};
