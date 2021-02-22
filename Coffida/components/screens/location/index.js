import React, { useEffect, useState } from 'react';
import { View, FlatList, StatusBar } from 'react-native';
import { Title, Button, Subheading, ActivityIndicator, FAB } from 'react-native-paper';
import styles from '../../../styles';
import AsyncStoreHelper from '../../AsyncStoreHelper';
import LocationObject from '../../LocationObject';
import ReviewObject from '../../ReviewObject';

const Location = ({navigation, route}) => {
    const [location, setLocation] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageURI, setImageURI] = useState(null);
    const [hasNotch, setHasNotch] = useState(0);
    const location_id = route.params.id;
    const back_button_arguments = route.params.backToNavigation;

    const get_location_details = async () => {
        await fetch(`http://10.0.2.2:3333/api/1.0.0/location/${location_id}`, {
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
            setReviews(data.location_reviews);
            setLoading(false);
        })
        .catch( (message) => { console.log("ERROR " + message); });
    } 

    useEffect( () => {
        const unsubscribe = navigation.addListener('focus', () => {get_location_details();});
        get_location_details();
        setHasNotch(StatusBar.currentHeight);
    }, []);

    if (loading) {
        return(
            <View
            accessbile={true}
            accessibilityLabel="Loading page." 
            style={[styles.size100, styles.whiteBackground]}>
                <ActivityIndicator/>
            </View>
        );
    } else {
        return (
            <View style={[styles.containerNoFlex,, styles.whiteBackground, hasNotch > 24 ? {paddingTop: hasNotch} : null]}>

                <LocationObject 
                location={location}
                navButton={false}
                image={imageURI}
                userFavourited={location.user_favourited}
                />

                <View
                accessible={true}
                accessibilityRole="header"
                accessibilityLabel="Header for reviews." 
                style={styles.reiviewHeadingWrapper}>
                    <Subheading>Reviews : {reviews.length}</Subheading>
                    <Button
                    accessibilityHint="Navigate to create new review page."
                    onPress={() => navigation.navigate("Review", {location_id: location_id, previous_review: undefined, has_image: null})}
                    style={styles.button40}
                    mode="contained"
                    icon="arrow-right">
                    Leave Review</Button>
                </View>

                <FlatList
                accesible={true}
                accessibilityRole="scrollbar"
                accessibilityLabel={`Scrollable list of reviews for ${location.location_name} in ${location.location_town}.`}
                data={reviews}
                keyExtractor={item => item.review_id.toString()}
                renderItem={({ item }) => ( 
                    <ReviewObject review={item} locationId={location.location_id} reviewListState={[reviews, setReviews]} navigation={navigation} setGlobalImageURI={setImageURI}/>
                )}/>

                <FAB
                accessible={true}
                accessibilityRole="button"
                accessibilityHint="Go back to previous page."
                style={[styles.locationBackButton, {top: hasNotch > 24 ? hasNotch + 20 : 20}]}
                small
                icon="arrow-left"
                onPress={() => navigation.navigate(back_button_arguments[0], back_button_arguments[1])}
                />

            </View>
        ); 
    }

};

export default Location;