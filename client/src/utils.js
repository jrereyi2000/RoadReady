import Config from 'react-native-config';
import { Dimensions } from 'react-native';
import { S3 } from 'aws-sdk';
import { Buffer } from 'buffer';

// action : { type : payload }
// { type: "name", payload: "JR" }
export const reducer = (state, action) => {
  const newState = { ...state };
  newState[action.type] = action.payload;
  return newState;
};

export const getDay = (dayIndex) => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex];
};

export const hasHomeButton = () => {
  return Dimensions.get('window').height < 700;
};

export const getBlob = ( fileUri ) => {
  return fetch(fileUri).then(
      (response) => {
        return response.blob();
      },
      (error) => {
        console.log(`Error in converting image to blob - ${error}`);
      },
  );
};

export const blobToBase64 = (blob) => {
  try {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  } catch (err) {
    console.log(`Error in converting blob to base64 - ${err}`);
    throw err;
  }
};

export const fileToBase64 = async (fileUri) => {
  const blob = await getBlob(fileUri);
  const base64 = await blobToBase64(blob);
  return base64;
};

export const uploadImageOnS3 = async (base64, filename) => {
  const s3bucket = new S3({
    accessKeyId: Config.IAM_USER_KEY,
    secretAccessKey: Config.IAM_USER_SECRET,
    Bucket: Config.S3_BUCKET_NAME,
    signatureVersion: 'v4',
  });
  const contentType = 'image/jpeg';
  const contentDeposition = 'inline;filename="' + filename + '"';

  const arrayBuffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');

  const params = {
    Bucket: Config.S3_BUCKET_NAME,
    Key: filename,
    Body: arrayBuffer,
    ContentDisposition: contentDeposition,
    ContentType: contentType,
    ContentEncoding: 'base64',
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        return '';
      } else {
        console.log('success');
        console.log('Response URL : ' + data.Location);
        resolve(data.Location);
      }
    });
  });
};

export const LOGFIELDS = {
  'Engine Compartment': [
    'Check Belts and hoses',
    'Check bolts and nuts',
    'Insert a Pic of engine showing belts and hoses',
  ],
  'Inspect Fluids': [
    'Check Underneath truck for fluid leaks',
    'Check coolant, engine oil and washer fluid levels',
  ],
  'Inspect Tires': [
    'Inspect tire treads, check cuts or budges, and tire pressure',
  ],
  'Coupling System': [
    'Check fifth wheel locking jaws, release arms, air lines',
    'Check dolly tires and air lines',
  ],
  'Dolly - Coupling System': [
    'Visual confirm dolly is properly secured to tractor or trailer',
    'Secure dolly chains to to tractor or trailer',
    'Insert pic of completed dolly coupling',
  ],
  'Inspect Lights and Reflectors': [
    'Check all exterior lights are working properly',
    'Check reflectors are free of dirt or debris or not missing',
  ],
  'Inspect Trailers': [
    'Inspect lights and reflectors',
    'Double check coupling',
    'Check trailer frame for damages',
  ],
  'Inside Cab': [
    'Check tractor gauges and indicators are working',
    'Check your city and highway horns',
    'Check for spare fuses and bulbs, extra gallon of coolant and washer fluid',
    'Check for 3 reflective triangles',
    'Check fire extinguisher and it is ready for use',
    'Check tractor documents are complete and current',
  ],
  'Tractor Frame': [
    'Check for tractor damage',
    'Check that IFTA and DoT inspection stickers are on the tractor',
    'Insert pics of front, left side, right side and rear view of tractor',
  ],
};

export const isDevAccount = (code, num) => {
  if (code === Config.CODE && num.replace(/-/g, '') === Config.PHONE_NUMBER) {
    return true;
  }

  if (code === Config.DEV_CODE && num.replace(/-/g, '') === Config.DEV_NUMBER) {
    return true;
  }

  return false;
};

export const isDevNumber = (num) => {
  return [Config.PHONE_NUMBER, Config.DEV_NUMBER].includes(
      num.replace(/-/g, ''),
  );
};
