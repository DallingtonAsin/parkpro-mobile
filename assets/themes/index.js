import { 
    DefaultTheme as NavigationDefaultTheme,
    DarkTheme as NavigationDarkTheme,
  } from '@react-navigation/native';
  
  import { 
    DefaultTheme as PaperDefaultTheme, 
    DarkTheme as PaperDarkTheme 
  } from 'react-native-paper';
import customStyles from '../css/styles';

export const customDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      primary: customStyles.colors.primary,
      secondary: customStyles.colors.white,
      dark: customStyles.colors.dark,
      background: customStyles.colors.primary,
      text: customStyles.colors.white,
      drawerBackground: customStyles.colors.white, 
      drawerText: customStyles.colors.dark, 
      body: customStyles.colors.white,
      bodyText: customStyles.colors.dark,
      icon: customStyles.colors.orange,
      btnLinearGradient1: customStyles.colors.defaultBtnLinearGradient1,
      btnLinearGradient2: customStyles.colors.defaultBtnLinearGradient2,
      activeTabColor: customStyles.colors.orange,

    },
  };

  export const customDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      primary: customStyles.colors.darkPink,
      secondary: customStyles.colors.white,
      dark: customStyles.colors.dark,
      background: customStyles.colors.darkPink,
      text: customStyles.colors.white,
      drawerBackground: customStyles.colors.darkPink, 
      drawerText: customStyles.colors.white, 
      body: customStyles.colors.white,
      bodyText: customStyles.colors.white,
      icon: customStyles.colors.darkPink,
      btnLinearGradient1: customStyles.colors.darkPink1,
      btnLinearGradient2: customStyles.colors.darkPink2,
      activeTabColor: customStyles.colors.darkPink,

    },
  };