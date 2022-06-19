import { useRef, useEffect } from 'react';
import { Linking } from 'react-native';
import Communications from 'react-native-communications';
import Rate, { AndroidMarket } from 'react-native-rate';
import {MAJOR_VERSION, MINOR_VERSION, PATCH_VERSION,PRE_RELEASE } from '@env';
import { getUniqueId } from 'react-native-device-info';
import { NetworkInfo } from "react-native-network-info";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const isUndefined = (state) => typeof state === "undefined";

export const callHelpLine = (phoneNumber) => {
  Communications.phonecall(phoneNumber, true);
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

export const getDeviceId = () => {
   return getUniqueId();
}

export const getDeviceIpAddress = async(x) => {
    return await NetworkInfo.getIPAddress();
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
  let version = `${MAJOR_VERSION}.${MINOR_VERSION}.${PATCH_VERSION}`;
  if (PRE_RELEASE) {
    version = version.concat(`-${PRE_RELEASE}`);
  }
  return version;
};

export const isValidateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


export const storeAccessToken = async(accessToken) => {
  var value = JSON.stringify(accessToken);
  try {
    await AsyncStorage.setItem("accessToken", value);
  } catch (error) {
    console.log(error);
  }
}

export const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
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

