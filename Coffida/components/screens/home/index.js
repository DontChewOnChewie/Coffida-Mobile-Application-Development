import React from 'react';
import {View, Text} from 'react-native';
import Test_Nav from '../../test_nav';
import styles from './styles';

const Home = (props) => {

    return (
        <View>
            <Text>Home Screen</Text>
            <Test_Nav></Test_Nav>
        </View>
    ); 

};

export default Home;