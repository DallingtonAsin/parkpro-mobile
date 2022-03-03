import { Linking } from 'react-native';
import Communications from 'react-native-communications';
import Rate, { AndroidMarket } from 'react-native-rate';
import {MAJOR_VERSION, MINOR_VERSION, PATCH_VERSION,PRE_RELEASE } from '@env';

const cache = {};

export const isUndefined = (state) => typeof state === "undefined";

export const callHelpLine = (phoneNumber) => {
  Communications.phonecall(phoneNumber, false);
};

export const SendEmail = (email) =>{
  Communications.email([email],null,null,'', '');
};

export const SendSms = (telephone_number) => {
  Communications.text(telephone_number, '');
}

export const inboxFromWhatsapp = (whatsappNumber) => {
   Linking.openURL(`whatsapp://send?text=&phone=${whatsappNumber}`);
}

export const Monetize = (num) => {
  return 'UGX ' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export const Numberize = (num) => {
  return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const getAppVersionName = () => {
  let version = `v.${MAJOR_VERSION}.${MINOR_VERSION}.${PATCH_VERSION}`;
  if (!PRE_RELEASE) {
      version = version.concat(`-${PRE_RELEASE}`);
  }

  return version;
};

 export const RateUs = () => {
  const options = {
    AppleAppID:"2193813192",
    GooglePackageName:"com.mywebsite.myapp",
    AmazonPackageName:"com.mywebsite.myapp",
    OtherAndroidURL:"http://www.randomappstore.com/app/47172391",
    preferredAndroidMarket: AndroidMarket.Google,
    preferInApp:false,
    openAppStoreIfInAppFails:true,
    fallbackPlatformURL:"http://www.mywebsite.com/myapp.html",
  }
  Rate.rate(options, (success, errorMessage)=>{
    if (success) {
    }
    if (errorMessage) {
      console.error(`Example page Rate.rate() error: ${errorMessage}`)
    }
  });
}

