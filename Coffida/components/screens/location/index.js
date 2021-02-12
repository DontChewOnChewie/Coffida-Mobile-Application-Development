import React, { useEffect, useState } from 'react';
import { View, FlatList} from 'react-native';
import { Title, Button, Subheading } from 'react-native-paper';
import styles from './styles';
import AsyncStoreHelper from '../../AsyncStoreHelper';
import LocationObject from '../../LocationObject';
import ReviewObject from '../../ReviewObject'

const Location = ({navigation, route}) => {
    const [location, setLocation] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const location_id = route.params.id;

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

                <View style={styles.reiviewHeadingWrapper}>
                    <Subheading>Reviews : {reviews.length}</Subheading>
                    <Button
                    onPress={() => navigation.navigate("Review", {location_id: location_id, previous_review: undefined})}
                    style={styles.leaveReviewButton}
                    mode="contained"
                    icon="arrow-right">
                    Leave Review</Button>
                </View>

                <FlatList
                data={reviews}
                keyExtractor={item => item.review_id.toString()}
                renderItem={({ item }) => ( 
                    <ReviewObject review={item} locationId={location.location_id} reviewListState={[reviews, setReviews]} navigation={navigation}/>
                )}/>
            </View>
        ); 
    }

};

export default Location;