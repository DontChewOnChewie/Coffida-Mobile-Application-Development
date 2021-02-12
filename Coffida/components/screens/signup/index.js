import React, { useState } from 'react';
import { ImageBackground, View } from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';
import styles from './styles';
import AsyncStoreHelper from '../../AsyncStoreHelper';
import { useEffect } from 'react';

const SignUp = ({navigation}) => {

    const [firstName, setFirstName] = useState("");
    const [secondName, setSecondName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(true);

    const attemptSignUp = async () => {
        fetch("http://10.0.2.2:3333/api/1.0.0/user", {
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
        creds !== null ? navigation.navigate("Home") : setLoading(false);
    }

    useEffect(() => {
        get_credentials();
    }, []);

    if (loading) {
        return (
            <Text>Loading</Text>
        );
    } else {
        return (
            <ImageBackground source={require('../../../images/loginBG.jpg')}
            style={styles.container}>

                <Text style={styles.header}>Sign Up</Text>

                <TextInput
                mode="outlined"
                style={styles.input}
                onChangeText={ text => setFirstName(text) }
                placeholder={"First Name..."}/>

                <TextInput
                mode="outlined"
                style={styles.input}
                onChangeText={ text => setSecondName(text) }
                placeholder={"Second Name..."}/>

                <TextInput
                mode="outlined"
                style={styles.input}
                onChangeText={ text => setEmail(text) }
                placeholder={"Email Address..."}/>

                <TextInput
                mode="outlined"
                style={styles.input}
                onChangeText={ text => setPassword(text) }
                placeholder={"Password..."}
                secureTextEntry={true}/>        

                <Button
                style={styles.loginButton}
                mode="contained"
                icon="arrow-right"
                onPress={ () => attemptSignUp() }>
                Sign Up</Button>

                <Button
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