import React, { useState } from 'react';
import { ImageBackground, View } from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';
import styles from './styles';

const SignUp = (props) => {

    const [firstName, setFirstName] = useState("");
    const [secondName, setSecondName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
           else console.log("Something went wrong with the status.");
        })
        .then( (data) => {
            console.log(data);
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }

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
        </ImageBackground>
    );

}

export default SignUp;