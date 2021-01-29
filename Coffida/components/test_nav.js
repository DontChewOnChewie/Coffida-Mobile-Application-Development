import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const Test_Nav = (props) => {

    return (
        <View>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>User</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Location</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );

};

const styles = StyleSheet.create({

    button : {
        width: '100%',
        height: '3%',
        backgroundColor: '#999999',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        marginVertical: 5,
    },
     
    buttonText : {
        color: 'white',
    },

});

export default Test_Nav;