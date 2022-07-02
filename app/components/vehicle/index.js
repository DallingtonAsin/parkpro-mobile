import React from 'react';
import { BottomSheet as BrSheet } from 'react-native-btr';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { Avatar } from 'react-native-paper';
import { SelectDropDown } from '../common/SelectDropdown';
import { UIActivityIndicator } from 'react-native-indicators';
import { useTheme } from '@react-navigation/native';
import design from '../../../assets/css/styles';
import { icons } from '../../../constants';
import {  Divider  } from 'react-native-paper';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView
} from '@gorhom/bottom-sheet';


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
        <Text style={styles.popupTitle}>{isEditingVehicle ? 'Edit vehicle details' : 'Add new vehicle'}</Text>
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

export const VehicleScreen = ({vehicleBottomSheetRef, snapPoints, renderVehiclesBackdrop,
                                handleVehicleSheetChanges,renderHeader, vehicles,
                                setIsSheetVisible, renderVehicles, 
                                isSheetVisible, toggleBottomNavigationView }) => {

                                  const { colors } = useTheme();
                                  const styles = makeStyles(colors);

  return (
    <>
     <BrSheet
        visible={isSheetVisible}
        onBackButtonPress={toggleBottomNavigationView}
        onBackdropPress={toggleBottomNavigationView}
        >
    <BottomSheet
    ref={vehicleBottomSheetRef}
    index={-1}
    
    snapPoints={snapPoints}
    enablePanDownToClose={true}
    backdropComponent={renderVehiclesBackdrop}
    onChange={handleVehicleSheetChanges}
    handleComponent={renderHeader}>
    
    <Divider style={styles.divider}/>
    
    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
    {
      vehicles.length > 0 
      ? vehicles.map(renderVehicles)
      : <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={styles.text}>No vehicles added yet.</Text>
      </View>
    }
    </BottomSheetScrollView>
    
    <TouchableOpacity style={styles.bottomSheetButton} onPress={setIsSheetVisible}>
    <Text style={design.vehicle.textAdd}>add vehicle</Text>
    </TouchableOpacity>
    
    </BottomSheet>
    </BrSheet>
    </>
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

      contentContainer: {
        alignItems: 'center',
        backgroundColor: colors.text,
      },

      bottomSheetButton:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth:1,
        marginLeft:10, 
        marginTop:15,
        marginBottom:80,
        height:50,
        width:'75%',
        borderRadius:30,
        borderColor:design.colors.primary,
      },

      addVehicleBodySection:{
        flex: 5, 
        backgroundColor: design.colors.white,
        padding:20 
      },

      popupTitle: {
        padding:10, 
        fontSize: 18,
        textTransform:'uppercase',
        fontWeight:'bold'
      },

      divider:{
        borderBottomColor: '#e2e2e2',
        borderBottomWidth: 1,
        marginTop:20
      },
      

});