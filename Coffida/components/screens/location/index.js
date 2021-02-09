import React, { useEffect, useState } from 'react';
import {TouchableOpacity, View, ToastAndroid, FlatList} from 'react-native';
import { Card, Text, Title, Paragraph, Button, Subheading } from 'react-native-paper';
import styles from './styles';
import NavBar from '../../navbar';
import AsyncStoreHelper from '../../AsyncStoreHelper';
import LocationObject from '../../LocationObject';
import ReviewObject from '../../ReviewObject'

const Location = (props) => {
    const [location, setLocation] = useState('');
    const [reviews, setReviews] = useState([]);
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

                <Subheading style={styles.commentTitle}>Comments : {reviews.length}</Subheading>
                <FlatList
                data={reviews}
                keyExtractor={item => item.review_id.toString()}
                renderItem={({ item }) => ( 
                    <ReviewObject review={item} locationId={location.location_id}/>
                )}/>
                <NavBar/>
            </View>
        ); 
    }

};

export default Location;