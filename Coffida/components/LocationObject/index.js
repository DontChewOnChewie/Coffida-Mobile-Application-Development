import React, {useEffect, useState} from 'react';
import { View, ToastAndroid, TouchableOpacity } from 'react-native';
import { Card, Text, Title, Paragraph, Button, Divider } from 'react-native-paper';
import styles from './styles';
import AsyncStoreHelper from '../AsyncStoreHelper';
import Icon from 'react-native-vector-icons/FontAwesome';

const DUMMY_IMG_PATH = 'http://cdn.dummyphoto.com';
const DEFAULT_IMG_PATH = 'http://innovate.bunzlcatering.co.uk/wp-content/uploads/2015/06/coffee-shop-1.jpg';
const FAVOURITE_COLOUR = '#6200ee';
const UNFAVOURITE_COLOR = '#b1b1b1';

const LocationObject = ({location, navButton}) => {
    const [favourite, setFavourite] = useState(false);
    const [iconColour, setIconColour] = useState(UNFAVOURITE_COLOR);
    const [locationImage, setLocationImage] = useState('');

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
            const is_favourite = (faves.filter(fave => fave.location_id === location.location_id).length) > 0;
            is_favourite ? setIconColour(FAVOURITE_COLOUR) : setIconColour(UNFAVOURITE_COLOR);
            setFavourite(is_favourite);
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }

    const handle_favourite_btn_click = async () => {
        try { var token =  JSON.parse(await AsyncStoreHelper.get_credentials()).token; }
        catch (error) { return; /* Catch for if no token stored. */ }

        fetch(`http://10.0.2.2:3333/api/1.0.0/location/${location.location_id}/favourite`, {
            method : favourite ? "delete": "post",
            headers: {
                'Content-Type': "application/json",
                "X-Authorization": token
            },
        })
        .then( (res) => {
           if (res.status == 200) {
               console.log("Hit API Success");
               favourite ? setIconColour(UNFAVOURITE_COLOR) : setIconColour(FAVOURITE_COLOUR);
               setFavourite(prevFavourite => !prevFavourite);
               ToastAndroid.showWithGravity(favourite ? "Removed from Favourite" : "Added to Favourites", ToastAndroid.SHORT, ToastAndroid.CENTER);
           }
           else console.log("Something went wrong with the status.");
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }

    const set_location_image = () => {
        if (location.photo_path == DUMMY_IMG_PATH 
            || location.photo_path == "" 
            || location.photo_path == null 
            || location.photo_path == undefined) setLocationImage(DEFAULT_IMG_PATH);
        else setLocationImage(location.photo_path);
    }

    useEffect(() => {
        set_user_has_favourite();
        set_location_image();
    }, []);

    return (
        <Card>
            <Card.Title
            title={location.location_name}
            subtitle={location.location_town}
            left={props => (
                <TouchableOpacity
                onPress={ handle_favourite_btn_click }>
                    <Icon name="star" size={25} color={iconColour}/>
                </TouchableOpacity>
            )}>
            </Card.Title>
            <Card.Cover source={{ uri: locationImage }} />
            <Card.Actions style={styles.cardActions}>
                { navButton ? (
                    <Button
                    mode="contained"
                    icon="arrow-right"
                    >
                    Check Out</Button>
                ): null}
            </Card.Actions>
            <Divider style={styles.divider}/>
        </Card>
    );

}

export default LocationObject;