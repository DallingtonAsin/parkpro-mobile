import React from 'react';
import { BottomSheet as BrSheet } from 'react-native-btr';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { Avatar } from 'react-native-paper';
import { SelectDropDown } from '../common/SelectDropdown';
import { UIActivityIndicator } from 'react-native-indicators';
import { useTheme } from '@react-navigation/native';
import design from '../../../assets/css/styles';
import { icons } from '../../../constants';

export const AddVehicleScreen = ({isSheetVisible,
                                  toggleBottomNavigationView,
                                  vehicleTypes, saveModalRef,
                                  openModal, handleVehicleNoChange,
                                  handleVehicleNameChange,
                                  vehicle, isLoading, onSelectedOption,
                                  registerVehicle, setIsSheetVisible,
                                  updateVehicle, closeAddVehicleScreen,
                                  isEditingVehicle,
                                   }) => {

    const { colors } = useTheme();
    const styles = makeStyles(colors);

    return (
        <BrSheet
        visible={isSheetVisible}
        onBackButtonPress={toggleBottomNavigationView}
        onBackdropPress={toggleBottomNavigationView}
        >
        
        <View style={{ flex:1 }}>
        
        <View style={styles.iconSection}>
        <Avatar.Icon icon={icons.uber} size={80} style={{backgroundColor: colors.text}} /> 
        </View>
        
        <View style={styles.addVehicleBodySection}>
        <View style={{alignItems:'center'}}>
        <Text style={styles.popupTitle}>Add new vehicle</Text>
        </View>
        
        <View style={styles.inputContainer}>
        <TextInput 
        name="vehicleNumber" 
        value={vehicle.number}
        onSubmitEditing={Keyboard.dismiss}
        onChangeText={handleVehicleNoChange}   
        style={styles.input}
        placeholderTextColor={design.colors.gray}
        placeholder={"Enter vehicle number e.g UAA 231Y"}/>
        </View>
        
        <View style={styles.inputContainer}>
        <TextInput 
        name="vehicleName" 
        value={vehicle.name}
        onSubmitEditing={Keyboard.dismiss}
        onChangeText={handleVehicleNameChange}
        style={styles.input}
        placeholderTextColor={design.colors.gray}
        placeholder={"Enter vehicle name e.g Toyota"}/>
        </View>
        
        <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => openModal()} style={{padding: 18, elevation:1, borderColor: 'gray'}}>
          <Text> {vehicle.type ? vehicle.type : 'Select vehicle type'}</Text>
        </TouchableOpacity>

        <SelectDropDown 
         items={vehicleTypes}
         saveModalRef={saveModalRef}
         onSelectedOption={onSelectedOption}
         background={colors.primary}
         textColor={colors.text}
         />

        </View>
        
        <View>
        <TouchableOpacity style={styles.submitVehicleBtn} onPress={ isEditingVehicle ?  updateVehicle  : registerVehicle }>
        {isLoading ?
          <UIActivityIndicator color='white' size={30} /> :
          <Text style={{color:design.colors.white, marginLeft:10, textTransform:'uppercase'}}>Submit</Text>
        }
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelBtn} onPress={closeAddVehicleScreen}>
        <Text style={{color:design.colors.dark, marginLeft:10, textTransform:'uppercase'}}>Cancel</Text>
        </TouchableOpacity>
        </View>
        
        </View>
        
        </View>
        </BrSheet>
    )
}

const makeStyles =  (colors) => StyleSheet.create({

    iconSection: {
        flex: 1,
        alignItems: 'center',
        padding:20, 
        justifyContent: 'center',
        backgroundColor: colors.primary
      },

      input: {
        backgroundColor: '#ffffff',
        borderRadius: 3,
        padding:10,
        borderWidth: 0.5,
        borderColor:design.colors.primary,
        fontSize:16,
        color: design.colors.black
      },

      inputContainer:{
        padding:10,
      },
      
      cancelBtn: {
        flexDirection: 'row', 
        borderWidth:1,
        marginLeft:10,
        marginRight:10,
        marginBottom:20,
        padding:15,
        borderRadius:50,
        borderColor:design.colors.primary,
        justifyContent: 'center', bottom:0, 
        backgroundColor:design.colors.white
      },

      submitVehicleBtn: {
        flexDirection: 'row', 
        marginLeft:10,
        marginRight:10,
        marginBottom:20,
        marginTop:15,
        padding:15,
        borderRadius:50,
        borderRadius:50,
        justifyContent: 'center', bottom:0,
        backgroundColor: colors.primary
      },

      addVehicleBodySection:{
        flex: 5, 
        backgroundColor: design.colors.white,
        padding:20 
      },

});