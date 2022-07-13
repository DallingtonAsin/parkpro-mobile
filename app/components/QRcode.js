import React from 'react';
import QRCode from 'react-native-qrcode-svg';


const QRCODE = ({getRef}) => {
    return(
        <QRCode
        value={'Dallington'}
        size={250}
        color="black"
        backgroundColor="white"
        getRef={getRef}
        />
        )
    }
    
    export default QRCODE
    
