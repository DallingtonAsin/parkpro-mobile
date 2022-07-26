import React from 'react';
import {View, Text} from 'react-native';
import styles from '../../../assets/css/styles';

export const renderHeader = (title) => {
    return(
      <View style={styles.bottomSheetPanel.bottomSheetHeader}>
         <View style={styles.bottomSheetPanel.panelHeader}>
           <View style={styles.bottomSheetPanel.panelHandle} />
             <Text style={styles.bottomSheetPanel.popupHeaderText}>{title}</Text>
         </View>
      </View>
      );
}