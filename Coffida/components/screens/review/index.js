import React, {useEffect, useState} from 'react';
import { View, ToastAndroid } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import styles from './styles';
import AsyncStoreHelper from '../../AsyncStoreHelper';
import ErrorPopUp from '../../ErrorPopUp';
import {ReviewValidation} from '../../InputHandler';

const Review = ({navigation, route}) => {
    const [priceRating, setPriceRating] = useState('');
    const [qualityRating, setQualityRating] = useState('');
    const [clenlisnessRating, setClenlisnessRating] = useState('');
    const [reviewBody, setReviewBody] = useState('');
    const [review, setReview] = useState(undefined);
    const [error, setError] = useState(null);
    const {location_id, previous_review} = route.params;

    const validate_review = () => {
        const isValid = ReviewValidation(priceRating, qualityRating, clenlisnessRating, reviewBody);
        typeof(isValid) !== "boolean" ? setError(isValid) : setError(null);
        return typeof(isValid) !== "boolean" ? false : true;
    }
    
    const submitReview = async () => {
        if (!validate_review()) return;

        try { var token =  JSON.parse(await AsyncStoreHelper.get_credentials()).token; }
        catch (error) { return; /* Catch for if no token stored. */ }

        fetch(`http://10.0.2.2:3333/api/1.0.0/location/${location_id}/review`, {
            method : "post",
            headers: {
                'Content-Type': "application/json",
                "X-Authorization": token
            },
            body: JSON.stringify({
                "overall_rating": parseInt((parseInt(priceRating) + parseInt(qualityRating) + parseInt(clenlisnessRating))/3),
                "price_rating": parseInt(priceRating),
                "quality_rating": parseInt(qualityRating),
                "clenliness_rating": parseInt(clenlisnessRating),
                "review_body": reviewBody
            })
        })
        .then( (res) => {
           if (res.status == 201) {
               ToastAndroid.showWithGravity("Review Added", ToastAndroid.SHORT, ToastAndroid.CENTER);
           }
           else console.log("Something went wrong with the status.");
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }

    const update_review = async () => {
        if (!validate_review()) return;

        try { var token =  JSON.parse(await AsyncStoreHelper.get_credentials()).token; }
        catch (error) { return; /* Catch for if no token stored. */ }

        fetch(`http://10.0.2.2:3333/api/1.0.0/location/${location_id}/review/${review.review_id}`, {
            method : "patch",
            headers: {
                'Content-Type': "application/json",
                "X-Authorization": token
            },
            body: JSON.stringify({
                "overall_rating": parseInt((parseInt(priceRating) + parseInt(qualityRating) + parseInt(clenlisnessRating))/3),
                "price_rating": parseInt(priceRating),
                "quality_rating": parseInt(qualityRating),
                "clenliness_rating": parseInt(clenlisnessRating),
                "review_body": reviewBody
            })
        })
        .then( (res) => {
           if (res.status == 200) {
               ToastAndroid.showWithGravity("Review Updated", ToastAndroid.SHORT, ToastAndroid.CENTER);
           }
           else console.log("Something went wrong with the status.");
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }
    
    useEffect(() => {
        if (previous_review !== undefined) {
            setReview(previous_review);
            setPriceRating(previous_review.price_rating);
            setQualityRating(previous_review.quality_rating);
            setClenlisnessRating(previous_review.clenliness_rating);
            setReviewBody(previous_review.review_body);
        }
    }, []);

    return (
        <View style={styles.container}>

            {error !== null ?
            <ErrorPopUp errorMessage={error} errorStateFunction={setError}/>
            : null}

            <Title>Leave a Review</Title>

            <TextInput
            style={styles.input}
            mode="outlined"
            placeholder="Price Rating..."
            onChangeText={text => setPriceRating(text)}
            keyboardType='number-pad'
            maxLength={1}
            value={priceRating.toString()}
            />

            <TextInput
            style={styles.input}
            mode="outlined"
            placeholder="Quality Rating..."
            onChangeText={text => setQualityRating(text)}
            keyboardType='number-pad'
            maxLength={1}
            value={qualityRating.toString()}
            />

            <TextInput
            style={styles.input}
            mode="outlined"
            placeholder="Clenliness Rating..."
            onChangeText={text => setClenlisnessRating(text)}
            keyboardType='number-pad'
            maxLength={1}
            value={clenlisnessRating.toString()}
            />

            <TextInput
            style={styles.largeInput}
            mode="outlined"
            multiline={true}
            numberOfLines={7}
            placeholder="Review Comment..."
            onChangeText={text => setReviewBody(text)}
            value={reviewBody}
            />

            <View style={styles.buttonLayout}>
                <Button
                style={styles.button}
                mode="contained"
                icon="arrow-right"
                onPress={() => review === undefined ? submitReview() : update_review()}>
                {review === undefined ? "Submit Review" : "Update Review"}</Button>

                <Button
                style={styles.button}
                mode="contained"
                icon="camera"
                onPress={() => navigation.navigate("Camera")}>
                Add a Picture</Button>
            </View>
                
        </View>
    );
}

export default Review