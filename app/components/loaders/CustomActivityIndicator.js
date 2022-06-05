
import React, { Component } from 'react';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
 
const CustomLoader = (props) => {
    return (
      <UIActivityIndicator 
      color={props.color ? props.color : 'black'} 
      animationDuration={props.duration ? props.duration : 1000} 
      size={props.size ? props.size : 40}/>
    );
}

export default CustomLoader;