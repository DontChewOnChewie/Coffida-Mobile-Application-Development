import React, {useEffect, useState} from 'react';
import { View, ToastAndroid, TouchableOpacity, ImageBackground } from 'react-native';
import { Button, TextInput, Title, Dialog, Paragraph } from 'react-native-paper';
import styles from './styles';
import AsyncStoreHelper from '../../AsyncStoreHelper';
import ErrorPopUp from '../../ErrorPopUp';
import {ReviewValidation} from '../../InputHandler';
import Icon from 'react-native-vector-icons/FontAwesome';

const LIKE_COLOR = '#6200ee';

const Review = ({navigation, route}) => {
    const [priceRating, setPriceRating] = useState('');
    const [qualityRating, setQualityRating] = useState('');
    const [clenlisnessRating, setClenlisnessRating] = useState('');
    const [reviewBody, setReviewBody] = useState('');
    const [review, setReview] = useState(undefined);
    const [error, setError] = useState(null);
    const [imageButtonDisabled, setImageButtonDisabled] = useState(true);
    const [reviewId, setReviewId] = useState('');

    const {location_id, previous_review, has_image} = route.params;

    const validate_review = () => {
        const isValid = ReviewValidation(priceRating, qualityRating, clenlisnessRating, reviewBody);
        typeof(isValid) !== "boolean" ? setError(isValid) : setError(null);
        return typeof(isValid) !== "boolean" ? false : true;
    }

    const get_new_review_id = async () => {
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
               return res.json();
           }
           else console.log("Something went wrong with the status.");
        })
        .then( (data) => {
            const last_review = data.reviews[data.reviews.length - 1];
            setReviewId(last_review.review.review_id);
        })
        .catch( (message) => { console.log("ERROR " + message); });
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
        .then( async (res) => {
           if (res.status == 201) {
               ToastAndroid.showWithGravity("Review Added", ToastAndroid.SHORT, ToastAndroid.CENTER);
               const new_review_id = await get_new_review_id();
               setImageButtonDisabled(false);
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

    const delete_image = async () => {
        try { var token =  JSON.parse(await AsyncStoreHelper.get_credentials()).token; }
        catch (error) { return; /* Catch for if no token stored. */ }

        fetch(`http://10.0.2.2:3333/api/1.0.0/location/${location_id}/review/${review.review_id}/photo`, {
            method : "delete",
            headers: {
                'Content-Type': "application/json",
                "X-Authorization": token
            },
        })
        .then( (res) => {
           if (res.status == 200) {
               ToastAndroid.show("Image Deleted", ToastAndroid.SHORT);
               setImageButtonDisabled(false);
           }
           else console.log("Something went wrong with the status.");
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }
    
    useEffect(() => {
        if (previous_review !== undefined) {
            setReviewId(previous_review.review_id)
            setReview(previous_review);
            setPriceRating(previous_review.price_rating);
            setQualityRating(previous_review.quality_rating);
            setClenlisnessRating(previous_review.clenliness_rating);
            setReviewBody(previous_review.review_body);
            has_image == null ? setImageButtonDisabled(false) : null;
        }
    }, []);

    return (
        <ImageBackground 
        accessible={true}
        accessibilityLabel="Background image of coffee on table."
        source={require('../../../images/loginBG.jpg')}
        style={styles.container}>

            {error !== null ?
            <ErrorPopUp errorMessage={error} errorStateFunction={setError}/>
            : null}

            <Title style={{color: 'white'}}>Leave a Review</Title>

            <TextInput
            accessibilityLabel="Form input for price rating."
            accessibilityValue={{min: 0, max: 5, now: priceRating}}
            style={styles.input}
            label="Price Rating..."
            onChangeText={text => setPriceRating(text)}
            keyboardType='number-pad'
            maxLength={1}
            value={priceRating.toString()}
            />

            <TextInput
            accessibilityLabel="Form input for quality rating."
            accessibilityValue={{min: 0, max: 0, now: qualityRating}}
            style={styles.input}
            label="Quality Rating..."
            onChangeText={text => setQualityRating(text)}
            keyboardType='number-pad'
            maxLength={1}
            value={qualityRating.toString()}
            />

            <TextInput
            accessibilityLabel="Form input for clenliness rating."
            accessibilityValue={{min: 0, max: 0, now: clenlisnessRating}}
            style={styles.input}
            label="Clenliness Rating..."
            onChangeText={text => setClenlisnessRating(text)}
            keyboardType='number-pad'
            maxLength={1}
            value={clenlisnessRating.toString()}
            />

            <TextInput
            accessibilityLabel="Form input for comments on location."
            accessibilityValue={{text: "Review body must be longer than 15 words but less than 500." }}
            style={styles.largeInput}
            multiline={true}
            numberOfLines={7}
            label="Review Body..."
            onChangeText={text => setReviewBody(text)}
            value={reviewBody}
            />

            <View style={styles.buttonLayout}>
                <Button
                accessibilityHint={`This will ${review == null ? "create" : "edit"} this review.`}
                style={styles.button}
                mode="contained"
                icon="arrow-right"
                onPress={() => review === undefined ? submitReview() : update_review()}>
                {review === undefined ? "Submit Review" : "Update Review"}</Button>

                <Button
                accessibilityHint={`Add an image for this review, currently ${imageButtonDisabled ? "disabled" : "enabled"}.`}
                style={styles.button}
                mode="contained"
                icon="camera"
                disabled={imageButtonDisabled}
                onPress={() => navigation.navigate("Camera", {location_id: location_id, review_id: reviewId})}>
                Add a Picture</Button>
            </View>

            {has_image != null ? 
            <TouchableOpacity 
                accessible={true}
                accessibilityRole="button"
                accessibilityHint="Delete image for this review."
                onPress={() => delete_image()}
                style={{flexDirection: 'row', marginLeft: 20, marginTop: 20}}>
                <Icon name="trash" size={25} color={LIKE_COLOR}></Icon>
                <Paragraph>Remove Image</Paragraph>
            </TouchableOpacity> : null}
                
        </ImageBackground>
    );
}

export default Review