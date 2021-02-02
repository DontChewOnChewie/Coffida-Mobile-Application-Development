import React from 'react';
import {View, Text, TouchableOpacity, Button} from 'react-native';
import styles from './styles';
import AsyncStoreHelper from '../../AsyncStoreHelper';

const Logout = (props) => {

    const try_logout = async () => {
        let token =  JSON.parse(await AsyncStoreHelper.get_credentials()).token;

        fetch("http://10.0.2.2:3333/api/1.0.0/user/logout", {
            method : "post",
            headers: {
                "X-Authorization": token
            }
        })
        .then( (res) => {
           if (res.status == 200) {
               AsyncStoreHelper.remove_credentials();
               console.log("Logout Successful");
               return;
           }
           else console.log("Something went wrong with the status.");
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }

    return (
        <View>
            <Text>If you log out you will not be able to leave reviews for any coffee shop.</Text>

            <TouchableOpacity>
                <Button
                onPress={ try_logout }
                title="Logout"/>
            </TouchableOpacity>

            <TouchableOpacity>
                <Button
                onPress= { AsyncStoreHelper.get_credentials }
                title="Get Credentials"/>
            </TouchableOpacity>
        </View>
    );

}

export default Logout;