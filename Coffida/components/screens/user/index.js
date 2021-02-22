import React, { useEffect, useState } from 'react';
import { View, ToastAndroid, ImageBackground } from 'react-native';
import { Button, TextInput, Text, FAB } from 'react-native-paper';
import styles from '../../../styles'
import AsyncStoreHelper from '../../AsyncStoreHelper';
import ErrorPopUp from '../../ErrorPopUp';
import {UserValidation} from '../../InputHandler';


const User = ({navigation}) => {
    const [firstName, setFirstName] = useState("");
    const [secondName, setSecondName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPasswrd] = useState("");

    const [favouriteLocations, setFavouriteLocations] = useState([]);
    const [reviewedLocations, setReviewedLocations] = useState([]);

    const [error, setError] = useState(null);

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
            setFavouriteLocations(data.favourite_locations);
            setReviewedLocations(data.reviews);
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }

    const validate_changes = () => {
        const isValid = UserValidation(firstName, secondName, email, password, confirmPassword);
        typeof(isValid) !== "boolean" ? setError(isValid) : setError(null);
        return typeof(isValid) !== "boolean" ? false : true;
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
        if (!validate_changes()) return;

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
        const unsubscribe = navigation.addListener('focus', () => {get_user_details();});
        get_user_details();
    }, []);

    return (
        <ImageBackground
        accessible={true}
        accessibilityLabel="Background image of coffee on table."
        source={require('../../../images/loginBG.jpg')}
        style={styles.container}>

            { error !== null ?
                <ErrorPopUp errorMessage={error} errorStateFunction={setError}/>
            : null}

            <Text style={styles.formTitle}>{firstName} {secondName}'s Page</Text>

            <TextInput
            accessibilityLabel="Form input for first name edit."
            style={styles.input60}
            onChangeText={ text => setFirstName(text) }
            value={firstName}
            label="First Name"/>   

            <TextInput
            accessibilityLabel="Form input for second name edit."
            style={styles.input60}
            onChangeText={ text => setSecondName(text) }
            value={secondName}
            label="Second Name"/>   

            <TextInput
            accessibilityLabel="Form input for email edit."
            style={styles.input60}
            onChangeText={ text => setEmail(text) }
            value={email}
            label="Email"/>   

            <TextInput
            accessibilityLabel="Form input for password edit."
            style={styles.input60}
            onChangeText={ text => setPassword(text) }
            value={password}
            label="Password"
            secureTextEntry={true}/>    

            <TextInput
            accessibilityLabel="Form input for confirming password edit."
            style={styles.input60}
            onChangeText={ text => setConfirmPasswrd(text) }
            value={confirmPassword}
            label="Confirm Password"
            secureTextEntry={true}/>   

            <Button
            accessibilityHint="Attempt to change your details to the form inputs above."
            style={styles.button60}
            mode="contained"
            icon="arrow-right"
            onPress={ () => change_user_details() }>
            Update Details</Button>

            <FAB
            accessible={true}
            accessibilityRole="button"
            accessibilityHint="Navigate to your activity page."
            style={styles.fabBottomRight}
            icon="plus"
            onPress={() => navigation.navigate("UserActivity", {favourite_locations: favouriteLocations, reviewed_locations: reviewedLocations})}
            />
        </ImageBackground>
    ); 

};

export default User;