import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import styles from './styles';

const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const try_login = () => {
        console.log(`Emaill : ${email}\nPassword : ${password}`)
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
            style={styles.loginButton}
            onPress={try_login}>
                <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>

        </View>
    );
};

export default Login;