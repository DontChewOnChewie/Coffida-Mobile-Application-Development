import React, { useEffect, useState } from 'react';
import {TouchableOpacity, View, ToastAndroid} from 'react-native';
import { Card, Text, Title, Paragraph, Button } from 'react-native-paper';
import styles from './styles';
import NavBar from '../../navbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStoreHelper from '../../AsyncStoreHelper';

const DUMMY_IMG_PATH = 'http://cdn.dummyphoto.com';
const DEFAULT_IMG_PATH = 'http://innovate.bunzlcatering.co.uk/wp-content/uploads/2015/06/coffee-shop-1.jpg';
const FAVOURITE_COLOUR = '#6200ee';
const UNFAVOURITE_COLOR = '#df5050';

const Location = (props) => {
    const [location, setLocation] = useState('');
    const [locationImage, setLocationImage] = useState('');
    const [userId, setUserId] = useState('');
    const [favourite, setFavourite] = useState(false);
    const [favouriteIconColour, setFavouriteIconColour] = useState('#df5050');

    const get_location_details = async () => {
        fetch(`http://10.0.2.2:3333/api/1.0.0/location/${props.id}`, {
            method : "get",
            headers: {
                'Content-Type': "application/json"
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
            setLocation(data);
            if (data.photo_path == DUMMY_IMG_PATH 
                || data.photo_path == "" 
                || data.photo_path == null 
                || data.photo_path == undefined) setLocationImage(DEFAULT_IMG_PATH);
            else setLocationImage(data.photo_path);
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }

    const handle_favourite_btn_click = async () => {
        try { var token =  JSON.parse(await AsyncStoreHelper.get_credentials()).token; }
        catch (error) { return; /* Catch for if no token stored. */ }

        fetch(`http://10.0.2.2:3333/api/1.0.0/location/${props.id}/favourite`, {
            method : favourite ? "delete": "post",
            headers: {
                'Content-Type': "application/json",
                "X-Authorization": token
            },
        })
        .then( (res) => {
           if (res.status == 200) {
               console.log("Hit API Success");
               favourite ? setFavouriteIconColour(UNFAVOURITE_COLOR) : setFavouriteIconColour(FAVOURITE_COLOUR);
               setFavourite(!favourite);
               ToastAndroid.showWithGravity(favourite ? "Removed from Favourite" : "Added to Favourites", ToastAndroid.SHORT, ToastAndroid.CENTER);
           }
           else console.log("Something went wrong with the status.");
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }

    const set_user_has_favourite = async () => {
        try { var {token, id} =  JSON.parse(await AsyncStoreHelper.get_credentials()); }
        catch (error) { return null; /* Catch for if no token stored. */ }

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
            const faves = data.favourite_locations;
            const is_favourite = (faves.filter(fave => fave.location_id.toString() === props.id).length) > 0;
            is_favourite ? setFavouriteIconColour(FAVOURITE_COLOUR) : setFavouriteIconColour(UNFAVOURITE_COLOR);
            setFavourite(is_favourite);
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }

    useEffect( () => {
        get_location_details();
        set_user_has_favourite();
    }, []);

    return (
        <View style={styles.container}>
            <Card>
                <Card.Content>
                    <View style={styles.titleContainer}>
                        <Title>{location.location_town}</Title>
                        <TouchableOpacity
                        onPress={ handle_favourite_btn_click }>
                            <Icon name="star" size={25} color={favouriteIconColour}/>
                        </TouchableOpacity>
                    </View>
                    <Paragraph>{location.location_name}</Paragraph>
                </Card.Content>
                <Card.Cover source={{ uri: locationImage }} />
                <Card.Actions style={styles.cardActions}>
                    <Button
                    icon="wallet"/>
                    <Button
                    icon="broom"/>
                    <Text>{location.avg_clenliness_rating}</Text>
                    <Text>{location.avg_overall_rating}/5</Text>
                </Card.Actions>
            </Card>
            <NavBar/>
        </View>
    ); 

};

export default Location;