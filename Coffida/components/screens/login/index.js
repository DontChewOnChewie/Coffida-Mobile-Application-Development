import React, {useState} from 'react';
import { ImageBackground } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import styles from './styles';
import AsyncStoreHelper from '../../AsyncStoreHelper';
import Background from './../../../images/loginBG.jpg';

const Login = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
        })
        .then( (data) => {
            if (data !== undefined) {
                AsyncStoreHelper.store_credentials(data);
                navigation.navigate("Home");
            }
        })
        .catch( (message) => { console.log("ERROR " + message); });
    };

    return (

            <ImageBackground 
                source={require('../../../images/loginBG.jpg')}
                style={styles.container} 
            >

                <Text style={styles.header}>Sign In</Text>

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
                mode="contained"
                icon="arrow-right"
                style={styles.loginButton}
                onPress={ () => try_login() }
                >Log In</Button>

                <Button
                mode="text"
                icon="arrow-right"
                color="white"
                onPress={ () => navigation.navigate("SignUp") }>
                Dont have an account?</Button>

            </ImageBackground>
    );
};

export default Login;