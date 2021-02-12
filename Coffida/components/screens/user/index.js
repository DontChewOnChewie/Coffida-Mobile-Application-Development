import React, { useEffect, useState } from 'react';
import { View, ToastAndroid } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import styles from './styles'
import NavBar from '../../navbar';
import AsyncStoreHelper from '../../AsyncStoreHelper';

const User = (props) => {
    const [firstName, setFirstName] = useState("");
    const [secondName, setSecondName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const get_user_details = async () => {
        try { var {token, id } =  JSON.parse(await AsyncStoreHelper.get_credentials()); }
        catch (error) { return; /* Catch for if no token stored. */ }

        fetch(`http://10.0.2.2:3333/api/1.0.0/user/${id}`, {
            method : "get",
            headers: {
                'Content-Type': "application/json",
                "X-Authorization": token
            },
        })
        .then( (res) => {
           if (res.status == 200) {
               console.log("Good Status");
               return res.json();
           }
           else console.log("Something went wrong with the status.");
        })
        .then( (data) => {
            setFirstName(data.first_name);
            setSecondName(data.last_name);
            setEmail(data.email);
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }

    const get_user_detail_changes_object = () => {
        const return_object = {}
        if (firstName !== "") return_object.first_name = firstName;
        if (secondName !== "") return_object.last_name = secondName;
        if (email !== "") return_object.email = email;
        if (password !== "") return_object.password = password;
        return return_object;
    }

    const change_user_details = async() => {
        const user_changes = get_user_detail_changes_object();
        try { var {token, id} =  JSON.parse(await AsyncStoreHelper.get_credentials()); }
        catch (error) { return; /* Catch for if no token stored. */ }

        fetch(`http://10.0.2.2:3333/api/1.0.0/user/${id}`, {
            method : "patch",
            headers: {
                'Content-Type': "application/json",
                "X-Authorization": token
            },

            body: JSON.stringify(user_changes)
        })
        .then( (res) => {
           if (res.status == 200) {
               console.log("Good Status");
               ToastAndroid.showWithGravity("Successfully Updated your Account!", ToastAndroid.SHORT, ToastAndroid.CENTER);
           }
           else console.log("Something went wrong with the status.");
        }).catch( (message) => { console.log("ERROR " + message); });
    }

    useEffect(() => {
        get_user_details();
    }, []);

    return (
        <View style={styles.container}>

            <Text style={styles.title}>{firstName} {secondName}'s Page</Text>

            <TextInput
            mode="outlined"
            style={styles.input}
            onChangeText={ text => setFirstName(text) }
            value={firstName}
            placeholder={"First Name..."}/>   

            <TextInput
            mode="outlined"
            style={styles.input}
            onChangeText={ text => setSecondName(text) }
            value={secondName}
            placeholder={"Second Name..."}/>   

            <TextInput
            mode="outlined"
            style={styles.input}
            onChangeText={ text => setEmail(text) }
            value={email}
            placeholder={"Email..."}/>   

            <TextInput
            mode="outlined"
            style={styles.input}
            onChangeText={ text => setPassword(text) }
            value={password}
            placeholder={"Password..."}
            secureTextEntry={true}/>    

            <Button
            style={styles.loginButton}
            mode="contained"
            onPress={ () => change_user_details() }>
            Update Details</Button>
        </View>
    ); 

};

export default User;