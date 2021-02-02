import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Button} from 'react-native';
import styles from './styles';
import AsyncStoreHelper from '../../AsyncStoreHelper';

const Login = (props) => {
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
        })
        .catch( (message) => { console.log("ERROR " + message); });
    };

    return (
        <View style={styles.container}>

            <TextInput
            style={styles.input}
            onChangeText={ text => setEmail(text) }
            placeholder={"Email Address..."}/>

            <TextInput
            style={styles.input}
            onChangeText={ text => setPassword(text) }
            placeholder={"Password..."}
            secureTextEntry={true}/>

            <TouchableOpacity
            style={styles.loginButton}>
                <Button
                onPress={ try_login }
                title="Log In"/>
            </TouchableOpacity>

            <TouchableOpacity>
                <Button
                onPress={ AsyncStoreHelper.get_credentials }
                title="Creds"/>
            </TouchableOpacity>

        </View>
    );
};

export default Login;