import React, { useState } from 'react';
import { ImageBackground, View } from 'react-native';
import { TextInput, Text, Button, ActivityIndicator } from 'react-native-paper';
import styles from '../../../styles';
import AsyncStoreHelper from '../../AsyncStoreHelper';
import { useEffect } from 'react';
import {UserValidation} from '../../InputHandler';
import ErrorPopUp from '../../ErrorPopUp';

const SignUp = ({navigation}) => {

    const [firstName, setFirstName] = useState("");
    const [secondName, setSecondName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(true);

    const validateSignUp = () => {
        const isValid = UserValidation(firstName, secondName, email, password, confirmPassword);
        typeof(isValid) !== "boolean" ? setError(isValid) : setError(null);
        return typeof(isValid) !== "boolean" ? false : true;
    }

    const attemptSignUp = async () => {
        if (!validateSignUp()) return;

        fetch("http://192.168.1.135:3333/api/1.0.0/user", {
            method : "post",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: secondName,
                email: email,
                password: password
            })
        })
        .then( (res) => {
           if (res.status == 201) {
               console.log("Good Status");
               return res.json();
           }
        })
        .then( (data) => {
            if (data !== undefined) navigation.navigate("Login");
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }

    const get_credentials = async () => {
        const creds = await AsyncStoreHelper.get_credentials();
        creds != null ? navigation.navigate("Home") : setLoading(false);
    }

    useEffect(() => {
        get_credentials();
    }, []);

    if (loading) {
        return (
            <View 
            accessbile={true}
            accessibilityLabel="Loading page."
            style={styles.container}>
                <ActivityIndicator/>
            </View>
        );
    } else {
        return (
            <ImageBackground 
            accessible={true}
            accessibilityLabel="Background image of coffee on table."
            source={require('../../../images/loginBG.jpg')}
            style={styles.container}>

                { error !== null ? 
                <ErrorPopUp errorMessage={error} errorStateFunction={setError}/>
                : null}
                <Text style={styles.formTitle}>Sign Up</Text>

                <TextInput
                accessibilityLabel="Form input for first name."
                label="First Name"
                style={styles.input60}
                onChangeText={ text => setFirstName(text) }/>

                <TextInput
                accessibilityLabel="Form input for second name."
                label="Second Name"
                style={styles.input60}
                onChangeText={ text => setSecondName(text) }/>

                <TextInput
                accessibilityLabel="Form input for email address."
                label="Email"
                style={styles.input60}
                onChangeText={ text => setEmail(text) }/>

                <TextInput
                accessibilityLabel="Form input for password."
                label="Password"
                style={styles.input60}
                onChangeText={ text => setPassword(text) }
                secureTextEntry={true}/>   

                <TextInput
                accessibilityLabel="Form input for confirming password."
                accessibilityHint="Must match previous input."
                label="Confirm Password"
                style={styles.input60}
                onChangeText={ text => setConfirmPassword(text) }
                secureTextEntry={true}/>       

                <Button
                accessibilityHint="Try signing up with inputted credentials."
                style={styles.button60}
                mode="contained"
                icon="arrow-right"
                onPress={ () => attemptSignUp() }>
                Sign Up</Button>

                <Button
                accessibilityLabel="Button to navigate to sign in page."
                accessibilityHint="Only use this if you already have an account."
                mode="text"
                icon="arrow-right"
                color="white"
                onPress={ () => navigation.navigate("Login") }>
                Already have an account?</Button>
            </ImageBackground>
        );
    }

}

export default SignUp;