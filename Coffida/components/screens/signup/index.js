import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
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
        <View>
            <TextInput
            style={styles.input}
            onChangeText={ text => setFirstName(text) }
            placeholder={"First Name..."}/>

            <TextInput
            style={styles.input}
            onChangeText={ text => setSecondName(text) }
            placeholder={"Second Name..."}/>

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
            onPress={ attemptSignUp }>
                <Text>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );

}

export default SignUp;