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
        fetch("http://10.0.2.2:3333/api/1.0.0/user/login", {
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
           if (res.status == 200) {
               return res.json();
           }
           else console.log("Something went wrong with the status.");
        })
        .then( (data) => {
            AsyncStoreHelper.store_credentials(data);
            navigation.navigate("Home");
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

            </ImageBackground>
    );
};

export default Login;