import React, {useEffect, useState} from 'react';
import { View, ToastAndroid, TouchableOpacity } from 'react-native';
import { Card, Text, Title, Paragraph, Button, Divider } from 'react-native-paper';
import styles from '../../styles';
import AsyncStoreHelper from '../AsyncStoreHelper';
import Icon from 'react-native-vector-icons/FontAwesome';
import RatingsBar from '../RatingsBar';

const DUMMY_IMG_PATH = 'http://cdn.dummyphoto.com';
const DEFAULT_IMG_PATH = 'http://innovate.bunzlcatering.co.uk/wp-content/uploads/2015/06/coffee-shop-1.jpg';
const FAVOURITE_ICON = "star";
const UNFAVOURITE_ICON = "star-o";
const FAVOURITE_COLOUR = '#6200ee';

const LocationObject = ({location, navButton, navigation, image, backToNavigation}) => {
    const [favourite, setFavourite] = useState(false);
    const [favouriteIcon, setFavouriteIcon] = useState(UNFAVOURITE_ICON);
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
            is_favourite ? setFavouriteIcon(FAVOURITE_ICON) : setFavouriteIcon(UNFAVOURITE_ICON);
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
               favourite ? setFavouriteIcon(UNFAVOURITE_ICON) : setFavouriteIcon(FAVOURITE_ICON);
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
        <Card
        accessible={true}
        accessibilityLabel={`Card for coffee named ${location.location_name} in ${location.location_town}.`}>
            <Card.Title
            accessible={true}
            accessibilityRole="header"
            title={location.location_name}
            subtitle={location.location_town}
            left={props => (
                <TouchableOpacity
                accessible={true}
                accessibilityRole="button"
                accessibilityHint={`${favourite ? "Unfavourite" : "Favourite"} this location.`}
                onPress={ handle_favourite_btn_click }>
                    <Icon 
                    accessible={true}
                    accessibilityLabel={`Icon of star showing favourite status. Current status if ${favourite ? "Favourite" : "Not favourite."}`}
                    name={favouriteIcon}
                    size={25} 
                    color={FAVOURITE_COLOUR}/>
                </TouchableOpacity>
            
            )}>
            </Card.Title>
            <Card.Cover 
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel={`Image of ${location.location_name} in ${location.location_town}.`}
            source={{ uri: image != null ? image : locationImage }}/>
            <Card.Actions style={styles.locationObjectActionsWrapper}>
                { navButton ? (
                    <Button
                    accessibilityHint={`Navigate to ${location.location_name} in ${location.location_town} page.`}
                    onPress={() => navigation.navigate('Location', { id: location.location_id, backToNavigation: backToNavigation })}
                    mode="contained"
                    icon="arrow-right"
                    >
                    Check Out</Button>
                ):
                <View 
                accessible={true}
                accessibilityLabel={`Ratings container for ${location.location_name} in ${location.location_town}.`}
                style={styles.width100}>
                    <RatingsBar title="Price Rating" icon="attach-money" rating={location.avg_price_rating}/>
                    <RatingsBar title="Quality Rating" icon="star-rate" rating={location.avg_quality_rating}/>
                    <RatingsBar title="Clenliness Rating" icon="cleaning-services" rating={location.avg_clenliness_rating}/>   
                </View>          
                }
            </Card.Actions>
            <Divider style={styles.divider}/>
        </Card>
    );

}

export default LocationObject;