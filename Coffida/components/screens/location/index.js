import React, { useEffect, useState } from 'react';
import {TouchableOpacity, View, ToastAndroid} from 'react-native';
import { Card, Text, Title, Paragraph, Button } from 'react-native-paper';
import styles from './styles';
import NavBar from '../../navbar';
import AsyncStoreHelper from '../../AsyncStoreHelper';
import LocationObject from '../../LocationObject/LocationObject';

const Location = (props) => {
    const [location, setLocation] = useState('');
    const [locationImage, setLocationImage] = useState('');
    const [favourite, setFavourite] = useState(false);
    const [favouriteIconColour, setFavouriteIconColour] = useState('#df5050');
    const [loading, setLoading] = useState(true);

    const get_location_details = async () => {
        await fetch(`http://10.0.2.2:3333/api/1.0.0/location/${props.id}`, {
            method : "get",
            headers: {
                'Content-Type': "application/json"
            },
        })
        .then( (res) => {
           if (res.status == 200) {
               return res.json();
           }
           else console.log("Something went wrong with the status.");
        })
        .then( (data) => {
            setLocation(data);
            setLoading(false);
        })
        .catch( (message) => { console.log("ERROR " + message); });
    } 

    useEffect( () => {
        get_location_details();
    }, []);

    if (loading) {
        return(
            <Title>Loading...</Title>
        );
    } else {
        return (
            <View style={styles.container}>
                <LocationObject 
                location={location}
                navButton={false}
                />
                <NavBar/>
            </View>
        ); 
    }

};

export default Location;