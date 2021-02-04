import React from 'react';
import { View } from 'react-native';
import { Appbar } from 'react-native-paper';
import styles from './styles';

const MyComponent = () => (
    <View style={styles.navContainer}>
        <Appbar style={styles.navBottom}>
        <Appbar.Action icon="home"/>
        <Appbar.Action icon="map-marker"/>
        <Appbar.Action icon="cog"/>
        <Appbar.Action icon="door-open"/>
        </Appbar>
     </View>
    );
   
   export default MyComponent