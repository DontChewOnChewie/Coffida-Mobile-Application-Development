import React, {useState} from 'react';
import {View, Image} from 'react-native';
import {Banner, Text, Button} from 'react-native-paper';
import styles from './styles';

const ErrorPopUp = ({errorMessage, errorStateFunction}) => {

    return (
      <Banner style={styles.bannerContainer}
        visible={true}
        actions={[{
            label: "Close",
            onPress: () => errorStateFunction(null),
        }]}>
        {errorMessage}
      </Banner>
    );

} 

export default ErrorPopUp;