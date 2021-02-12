import React from 'react';
import { View } from 'react-native';
import { Text, Button, Paragraph, Subheading } from 'react-native-paper';
import styles from './styles';
import AsyncStoreHelper from '../../AsyncStoreHelper';

const Logout = ({navigation}) => {

    const try_logout = async () => {
        try { var token =  JSON.parse(await AsyncStoreHelper.get_credentials()).token; }
        catch (error) { return; /* Catch for if no token stored. */ }

        fetch("http://10.0.2.2:3333/api/1.0.0/user/logout", {
            method : "post",
            headers: {
                "X-Authorization": token
            }
        })
        .then( (res) => {
           if (res.status == 200) {
               AsyncStoreHelper.remove_credentials();
               navigation.navigate("Login");
               return;
           }
           else console.log("Something went wrong with the status.");
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }

    return (
        <View style={styles.container}>
            <Subheading style={styles.message}>If you log out you will not be able to leave reviews for any coffee shop.</Subheading>

            <Button
            style={styles.loginButton}
            mode="contained"
            icon="door-open"
            onPress={ () => try_logout() }
            >Logout</Button>
        </View>
    );

}

export default Logout;