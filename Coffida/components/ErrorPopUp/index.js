import React, {useState} from 'react';
import {View, Image} from 'react-native';
import {Banner, Text, Button} from 'react-native-paper';
import styles from '../../styles';

const ErrorPopUp = ({errorMessage, errorStateFunction}) => {

    return (
      <Banner style={styles.bannerContainer}
        accessible={true}
        accessibilityRole="alert"
        accessibilityLabel="Error Banner"
        accessibilityHint={`Error with form inputs is ${errorMessage}`}
        visible={true}
        actions={[{
            label: "Close",
            onPress: () => errorStateFunction(null),
        }]}>
        <Text style={styles.ratingTitle}>{errorMessage}</Text>
      </Banner>
    );

} 

export default ErrorPopUp;