import React, {useState} from 'react';
import { ImageBackground } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import styles from './styles';
import AsyncStoreHelper from '../../AsyncStoreHelper';
import Background from './../../../images/loginBG.jpg';
import ErrorPopUp from '../../ErrorPopUp';

const Login = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const try_login = async () => {
        fetch("http://192.168.1.135:3333/api/1.0.0/user/login", {
            method : "post",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then( (res) => {
            console.log(res.status);
           if (res.status == 200) return res.json();
           else {setError("Account credentials are not valid.")}
        })
        .then( (data) => {
            if (data != undefined) {
                AsyncStoreHelper.store_credentials(data);
                navigation.navigate("Home", {screen: "Home"});
            }
        })
        .catch( (message) => { console.log("ERROR " + message); });
    };

    return (

            <ImageBackground 
            accessible={true}
            accessibilityLabel="Background image of coffee on table."
            source={require('../../../images/loginBG.jpg')}
            style={styles.container} >

                { error !== null ? 
                <ErrorPopUp errorMessage={error} errorStateFunction={setError}/>
                : null}

                <Text style={styles.header}>Sign In</Text>

                <TextInput
                accessibilityLabel="Account email."
                label="Account Email"
                style={styles.input}
                onChangeText={ text => setEmail(text) }/>

                <TextInput
                accessibilityLabel="Account password."
                label="Account Password"
                style={styles.input}
                onChangeText={ text => setPassword(text) }
                secureTextEntry={true}/>

                <Button
                accessibilityHint="Try signing into account with given credentials."
                mode="contained"
                icon="arrow-right"
                style={styles.loginButton}
                onPress={ () => try_login() }
                >Log In</Button>

                <Button
                accessibilityLabel="Button to navigate to sign up page."
                accessibilityHint="Only use this if you do not have an account already."
                mode="text"
                icon="arrow-right"
                color="white"
                onPress={ () => navigation.navigate("SignUp") }>
                Dont have an account?</Button>

            </ImageBackground>
    );
};

export default Login;